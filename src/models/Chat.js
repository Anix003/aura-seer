import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    trim: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver ID is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxLength: [1000, 'Message cannot exceed 1000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

chatSchema.index({ roomId: 1, timestamp: -1 });
chatSchema.index({ senderId: 1, timestamp: -1 });
chatSchema.index({ receiverId: 1, seen: 1 });
chatSchema.index({ timestamp: -1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;