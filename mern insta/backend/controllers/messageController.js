import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

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

        await Promise.all([conversation.save(), newMessage.save()]);

        //implement socket io for real time data transfer


        return res.status(201).json({success: true, message: 'Message sent successfully'});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({ 
            participants: { $all: [senderId, receiverId]}
        });

        if (!conversation) {
            return res.status(404).json({success: false, message: 'Conversation not found'});
        }

        return res.status(200).json({success: true, messages: conversation.message});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}