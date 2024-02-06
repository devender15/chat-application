"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useSocket } from "@/contexts/socket";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import VideoControls from "./video-controls";

import { Profile } from "@prisma/client";

interface VideoScreenProps {
  conversationId: string;
  currentMember: Profile;
  otherMember: Profile;
}

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:stun2.1.google.com:19302",
    },
  ],
};

export default function VideoScreen({
  conversationId,
  currentMember,
  otherMember,
}: VideoScreenProps) {
  const videoRefSelf = useRef<HTMLVideoElement | null>(null);
  const videoRefOther = useRef<HTMLVideoElement | null>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const selfStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<boolean>(false);

  const { toast } = useToast();
  const { socket } = useSocket();
  const router = useRouter();

  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const VIDEO_CONSTRAINTS = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
  };

  const handleRoomCreated = () => {
    hostRef.current = true;
    navigator.mediaDevices
      .getUserMedia(VIDEO_CONSTRAINTS)
      .then((stream) => {
        selfStreamRef.current = stream;
        if (videoRefSelf.current) {
          videoRefSelf.current.srcObject = stream;
        }
        if (videoRefSelf.current) {
          videoRefSelf.current.onloadedmetadata = () => {
            videoRefSelf.current?.play();
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia(VIDEO_CONSTRAINTS)
      .then((stream) => {
        selfStreamRef.current = stream;
        if (videoRefSelf.current) {
          videoRefSelf.current.srcObject = stream;
        }
        if (videoRefSelf.current) {
          videoRefSelf.current.onloadedmetadata = () => {
            videoRefSelf.current?.play();
          };
        }
        socket.emit("ready", { roomId: conversationId });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInitiateCall = () => {
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();

      rtcConnectionRef.current?.addTrack(
        //@ts-ignore
        selfStreamRef.current?.getTracks()[0],
        selfStreamRef.current
      );

      rtcConnectionRef.current?.addTrack(
        //@ts-ignore
        selfStreamRef.current?.getTracks()[1],
        selfStreamRef.current
      );

      rtcConnectionRef.current
        ?.createOffer()
        .then((offer) => {
          rtcConnectionRef.current?.setLocalDescription(offer);
          socket.emit("offer", offer, conversationId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleNegotiationNeededEvent = async () => {
    try {
      const newOffer = await rtcConnectionRef.current?.createOffer();
      if (newOffer) {
        await rtcConnectionRef.current?.setLocalDescription(newOffer);
        if (rtcConnectionRef.current) {
          socket.emit(
            "offer",
            rtcConnectionRef.current.localDescription,
            conversationId
          );
        }
      }
    } catch (err) {
      console.error("Error handling renegotiation:", err);
    }
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleIceCandidateEvent;
    connection.onnegotiationneeded = handleNegotiationNeededEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      if (
        rtcConnectionRef.current?.signalingState === "have-local-offer" ||
        rtcConnectionRef.current?.signalingState === "have-remote-offer" ||
        rtcConnectionRef.current?.signalingState === "stable"
      ) {
        rtcConnectionRef.current
          ?.setRemoteDescription(offer)
          .then(() => {
            selfStreamRef.current?.getTracks().forEach((track) => {
              rtcConnectionRef.current?.addTrack(track, selfStreamRef.current!);
            });

            return rtcConnectionRef.current?.createAnswer();
          })
          .then((answer) =>
            rtcConnectionRef.current?.setLocalDescription(answer)
          )
          .then(() => {
            if (rtcConnectionRef.current) {
              socket.emit(
                "answer",
                rtcConnectionRef.current.localDescription,
                conversationId
              );
            }
          })
          .catch((err) => {
            console.error("Error handling received offer:", err);
          });
      } else {
        console.warn(
          "Invalid signaling state for setting remote answer:",
          rtcConnectionRef.current?.signalingState
        );
      }
    }
  };

  const handleAnswer = (answer: RTCSessionDescription) => {
    console.log(rtcConnectionRef.current?.currentRemoteDescription);
    if (!rtcConnectionRef.current?.currentRemoteDescription) {
      rtcConnectionRef.current?.setRemoteDescription(answer).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate, conversationId);
    }
  };

  const handleNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    if (rtcConnectionRef.current?.remoteDescription) {
      const candidate = new RTCIceCandidate(incoming);
      rtcConnectionRef.current?.addIceCandidate(candidate).catch((err) => {
        console.error("Error adding ice candidate:", err);
      });
    } else {
      console.warn("Remote description is null. Ice candidate not added.");
    }
  };
  //@ts-ignore
  const handleTrackEvent = (event) => {
    if (videoRefOther.current) {
      videoRefOther.current.srcObject = event.streams[0];
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave", { roomId: conversationId, member: currentMember });

    if (videoRefSelf.current?.srcObject) {
      videoRefSelf.current.srcObject
        //@ts-ignore
        .getTracks()
        //@ts-ignore
        .forEach((track) => track.stop());
    }

    if (videoRefOther.current?.srcObject) {
      videoRefOther.current.srcObject
        //@ts-ignore
        .getTracks()
        //@ts-ignore
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }

    router.push(`/chat/${otherMember.id}`);
  };

  const onPeerLeave = () => {
    hostRef.current = true;

    if (videoRefOther.current?.srcObject) {
      videoRefOther.current.srcObject
        //@ts-ignore
        .getTracks()
        //@ts-ignore
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const handleStartScreenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: false })
      .then((stream) => {
        selfStreamRef.current = stream;
        if (videoRefSelf.current) {
          videoRefSelf.current.srcObject = stream;
          setIsScreenSharing(true);
        }
        if (videoRefSelf.current) {
          videoRefSelf.current.onloadedmetadata = () => {
            videoRefSelf.current?.play();
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStopScreenShare = () => {
    navigator.mediaDevices
      .getUserMedia(VIDEO_CONSTRAINTS)
      .then((stream) => {
        selfStreamRef.current = stream;
        if (videoRefSelf.current) {
          videoRefSelf.current.srcObject = stream;
          setIsScreenSharing(false);
        }
        if (videoRefSelf.current) {
          videoRefSelf.current.onloadedmetadata = () => {
            videoRefSelf.current?.play();
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleMediaStream = (type: string, state: boolean) => {
    selfStreamRef.current?.getTracks().forEach((track) => {
      if (track.kind === type) {
        // eslint-disable-next-line no-param-reassign

        track.enabled = !state;
      }
    });
  };

  const toggleCamera = () => {
    toggleMediaStream("video", cameraActive);
    setCameraActive((prev) => !prev);
  };

  const toggleMic = () => {
    toggleMediaStream("audio", micActive);

    setMicActive((prev) => !prev);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("join", { roomId: conversationId, member: currentMember });
      socket.on(`created`, handleRoomCreated);
      socket.on(`joined`, ({ member }: { roomId: string; member: Profile }) => {
        handleRoomJoined();
        toast({
          title: `${
            member.id === currentMember.id ? "You" : member.name
          } joined the meeting!`,
        });
      });

      socket.on(`full`, () => {
        router.push("/chat");
        toast({
          title: "Room already full!",
        });
      });

      socket.on("ready", handleInitiateCall);

      socket.on("leave", onPeerLeave);

      socket.on("offer", handleReceivedOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleNewIceCandidateMsg);
    }

    return () => {
      if (socket) {
        socket.emit("leave", { roomId: conversationId, member: currentMember });
      }
    };
  }, [conversationId, socket]);

  return (
    <div className="min-h-[80svh] w-full  flex-grow flex-col gap-4 items-center">
      <div className="flex flex-col md:!flex-row gap-4 h-full w-full items-center relative justify-center">
        <div className="basis-1/2 h-full border rounded-xl shadow-md bg-white dark:bg-transparent">
          <video
            autoPlay
            ref={videoRefSelf}
            className="w-full h-full object-cover rounded-xl"
          />
          {/* {cameraActive ? (
            <video
              autoPlay
              ref={videoRefSelf}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-gray-400/50 rounded-xl">
              <Avatar>
                <AvatarImage src={currentMember.imageUrl} />
                <AvatarFallback>
                  {currentMember.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
          )} */}
        </div>
        <div className="w-full md:basis-1/2 h-full border rounded-xl shadow-md bg-white dark:bg-transparent">
          <video
            autoPlay
            ref={videoRefOther}
            className="w-full h-full object-cover rounded-xl"
          />
          {/* {cameraActive ? (
            <video
              autoPlay
              ref={peerVideoRef}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <Avatar>
                <AvatarImage src={otherMember.imageUrl} />
                <AvatarFallback>
                  {otherMember.name.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>
          )} */}
        </div>

        <VideoControls
          toggleCamera={toggleCamera}
          toggleMic={toggleMic}
          handleLeaveRoom={handleLeaveRoom}
          cameraActive={cameraActive}
          micActive={micActive}
          handleStartScreenShare={handleStartScreenShare}
          handleStopScreenShare={handleStopScreenShare}
          isScreenSharing={isScreenSharing}
        />
      </div>
    </div>
  );
}
