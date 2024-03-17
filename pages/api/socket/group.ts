import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { Profile } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);

    const { name, description, members } : {name: string, description: string, members: Profile[]} = req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if(members.length === 0) {
        return res.status(400).json({ message: "Members are required" });
    }

    const group = await db.group.create({
        data: {
            name,
            description: description || "", // this field is optional
            admin: {
                connect: {
                    id: profile.id,
                },
            },
            members: {
                connect: members.map(member => ({ id: member.id })),
            },
        },
        include: {
            members: true,
        },
    });

    console.log(group);

    members.forEach(member => {
        const groupNotificationKey = `groupCreateUpdate:${member.userId}`;
        res?.socket?.server?.io?.emit(groupNotificationKey, { message: `${profile.name} added you to ${name}!`, group });
    })    

    res.status(200).json({ message: "Group created successfully!", group });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
