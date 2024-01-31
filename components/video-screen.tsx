"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useSocket } from "@/contexts/socket";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Profile } from "@prisma/client";

interface VideoScreenProps {
  conversationId: string;
  currentMember: Profile;
  otherMember: Profile;
}

export default function VideoScreen({
  conversationId,
  currentMember,
  otherMember,
}: VideoScreenProps) {
  const videoRefSelf = useRef<HTMLVideoElement | null>(null);
  const videoRefOther = useRef<HTMLVideoElement | null>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection>(null);
  const selfStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<boolean>(false);

  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(true);

  const { socket } = useSocket();

  const VIDEO_CONSTRAINTS = {
    audio: true,
    // video: {
    //   width: { min: 640, ideal: 1920, max: 1920 },
    //   height: { min: 480, ideal: 1080, max: 1080 },
    // },
    video: { width: 500, height: 500 },
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
        // selfStreamRef.current = stream;
        // if (videoRefSelf.current) {
        //   videoRefSelf.current.srcObject = stream;
        // }
        // if (videoRefSelf.current) {
        //   videoRefSelf.current.onloadedmetadata = () => {
        //     videoRefSelf.current?.play();
        //   };

        //   socket.emit("ready", { roomId: conversationId });
        // }
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
        selfStreamRef.current?.getTracks()[0],
        selfStreamRef.current
      );

      rtcConnectionRef.current?.addTrack(
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

  const ICE_SERVERS = {
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
    ],
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleIceCandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleReceivedOffer = (offer) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();

      rtcConnectionRef.current.addTrack(
        selfStreamRef.current?.getTracks()[0],
        selfStreamRef.current
      );

      rtcConnectionRef.current.addTrack(
        selfStreamRef.current?.getTracks()[1],
        selfStreamRef.current
      );

      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((answer) => {
          rtcConnectionRef.current?.setLocalDescription(answer);
          socket.emit("answer", answer, conversationId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAnswer = (answer) => {
    rtcConnectionRef.current?.setRemoteDescription(answer).catch((err) => {
      console.log(err);
    });
  };

  const handleIceCandidateEvent = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate, conversationId);
    }
  };

  const handleNewIceCandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current?.addIceCandidate(candidate).catch((err) => {
      console.log(err);
    });
  };

  const handleTrackEvent = (event) => {
    if (videoRefOther.current) {
      videoRefOther.current.srcObject = event.streams[0];
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave", { roomId: conversationId });

    if (videoRefSelf.current?.srcObject) {
      videoRefSelf.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (videoRefOther.current?.srcObject) {
      videoRefOther.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }

    router.push("/video");
  };

  const onPeerLeave = () => {
    hostRef.current = true;

    if (videoRefOther.current?.srcObject) {
      videoRefOther.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const toggleMediaStream = (type, state) => {
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

  useEffect(() => {
    if (socket) {
      socket.emit("roomJoin", { roomId: conversationId });

      //@ts-ignore
      socket.on(`roomCreated:${conversationId}`, handleRoomCreated);
      //@ts-ignore
      socket.on(`roomJoined:${conversationId}`, handleRoomJoined);
      //@ts-ignore
      socket.on(`roomFull:${conversationId}`, (data) => {
        console.log(data);
      });

      socket.on("ready", handleInitiateCall);

      socket.on("leave", onPeerLeave);

      socket.on("offer", handleReceivedOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleNewIceCandidateMsg);
    }

    return () => {
      if (socket) {
        socket.emit("leave", { roomId: conversationId });
      }
    };
  }, [conversationId, socket]);

  return (
    <div className="min-h-[80svh] overflow-y-auto flex-grow flex-col gap-4 items-center">
      <div className="flex gap-x-4 items-center">
        <div className="w-[20rem] h-[20rem] border rounded-md shadow-sm">
          {videoRefSelf.current ? (
            <video autoPlay ref={videoRefSelf} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
            <Avatar>
              <AvatarImage src={currentMember.imageUrl} />
              <AvatarFallback>
                {currentMember.name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            </div>
          )}
        </div>
        <div className="w-[20rem] h-[20rem] border rounded-md shadow-sm">
          {videoRefOther.current ? (
            <video autoPlay ref={videoRefOther} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
            <Avatar>
              <AvatarImage src={otherMember.imageUrl} />
              <AvatarFallback>
                {otherMember.name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            </div>
          )}
        </div>
      </div>
      <button onClick={toggleCamera} type="button">
        {cameraActive ? "Stop Camera" : "Start Camera"}
      </button>
      <button onClick={handleLeaveRoom} type="button">
        Leave
      </button>
    </div>
  );
}
