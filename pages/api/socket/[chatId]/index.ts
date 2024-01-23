import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { currentProfilePages } from "@/lib/current-profile-pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);

    const { chatId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOneId: profile.id,
          },
          {
            memberTwoId: profile.id,
          },
        ],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    let dm = await db.directMessage.findFirst({
      where: {
        id: chatId as string,
        conversationId: conversationId as string,
      },
      include: {
        profile: true,
      },
    });

    if (!dm || dm.deleted) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (req.method === "DELETE") {
      dm = await db.directMessage.update({
        where: {
          id: chatId as string,
        },
        data: {
          fileUrl: undefined,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          profile: true,
        },
      });
    }

    if (req.method === "PATCH") {
      dm = await db.directMessage.update({
        where: {
          id: chatId as string,
        },
        data: {
          content,
        },
        include: {
          profile: true,
        },
      });
    }

    const updateKey = `updateChat:${conversationId}`;
    res?.socket?.server?.io?.emit(updateKey, dm);

    res.status(200).json(dm);
  } catch (error) {
    res.status(500).json({ message: "something went wrong!" });
  }
}
