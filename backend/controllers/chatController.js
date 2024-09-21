const Chat = require('../models/Chat');
const { encryptMessage, decryptMessage } = require('../encryption/encryption');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, recipient, message } = req.body;

    const encryptedMessage = await encryptMessage(message);
    const chat = new Chat({ sender, recipient, message: encryptedMessage });
    await chat.save();

    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ $or: [{ sender: userId }, { recipient: userId }] });

    const decryptedChats = await Promise.all(
      chats.map(async (chat) => {
        const decryptedMessage = await decryptMessage(chat.message);
        return { ...chat._doc, message: decryptedMessage };
      })
    );

    res.status(200).json({ success: true, chats: decryptedChats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
