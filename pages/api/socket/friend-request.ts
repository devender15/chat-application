import { NextApiResponse, NextApiRequest } from "next";


import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(401).json({ error: "Conversation id is missing!" });
    }

    if (!content) {
      return res.status(400).json({ error: "No content!" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found!" });
    }

    const newMessage = await db.message.create({
      data: {
        content,
        fileUrl,
        conversation: {
          connect: {
            id: conversation.id,
          },
        },
        sender: {
          connect: {
            id: conversation.memberOneId,
          },
        },
        receiver: {
          connect: {
            id: conversation.memberTwoId,
          },
        },
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        receiver: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Message sent!", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}