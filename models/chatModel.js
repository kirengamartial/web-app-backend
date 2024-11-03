import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
chatSchema.index({ room: 1, createdAt: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;