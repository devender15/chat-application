import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    if (!conversationId) {
      return res.status(401).json({ error: "Conversation id is missing!" });
    }

    if (!content) {
      return res.status(400).json({ error: "No content!" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              id: profile.id,
            },
          },
          {
            memberTwo: {
              id: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found!" });
    }

    const member =
      conversation.memberOne.id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    const otherMember =
      conversation.memberOne.id !== profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found!" });
    }

    if (!otherMember) {
      return res.status(404).json({ message: "Other member not found!" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        profileId: member.id,
      },
      include: {
        profile: true,
      },
    });

    const dmKey = `chat:${conversationId}:${otherMember.id}:messages`;

    res?.socket?.server?.io?.emit(dmKey, message);

    return res.status(200).json("");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
