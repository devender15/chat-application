import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if(req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {

        const { content, fileUrl } = req.body;

        res?.socket?.server?.io?.emit(content);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}