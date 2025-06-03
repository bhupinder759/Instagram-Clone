import { Conversation } from "../models/conversationModel";
import { Message } from "../models/messageModel";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const message = req.body;

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId]}});

        //stablish the conversation if not started yet.
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] });
        }

        const newMessage = await Message.create({ senderId, receiverId, message });

        if (newMessage) conversation.message.push(newMessage._id);

        return res.status(200).json({success: true, message: 'Message sent successfully'});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}