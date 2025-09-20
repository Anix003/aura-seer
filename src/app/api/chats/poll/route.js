import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const lastMessageId = searchParams.get('lastMessageId');
    const limit = parseInt(searchParams.get('limit')) || 20;

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const [patientId, doctorId] = roomId.split('_');
    if (user.userId !== patientId && user.userId !== doctorId) {
      return NextResponse.json({ error: 'Access denied to this chat room' }, { status: 403 });
    }

    let query = { roomId };

    if (lastMessageId) {
      const lastMessage = await Chat.findById(lastMessageId);
      if (lastMessage) {
        query.timestamp = { $gt: lastMessage.timestamp };
      }
    }

    const messages = await Chat.find(query)
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role')
      .sort({ timestamp: 1 })
      .limit(limit);

    const unseenMessageIds = messages
      .filter(msg => msg.receiverId._id.toString() === user.userId && !msg.seen)
      .map(msg => msg._id);

    if (unseenMessageIds.length > 0) {
      await Chat.updateMany(
        { _id: { $in: unseenMessageIds } },
        { seen: true }
      );
    }

    return NextResponse.json({
      messages: messages.map(msg => ({
        id: msg._id,
        message: msg.message,
        timestamp: msg.timestamp,
        seen: msg.seen,
        sender: {
          id: msg.senderId._id,
          name: msg.senderId.name,
          role: msg.senderId.role
        },
        receiver: {
          id: msg.receiverId._id,
          name: msg.receiverId.name,
          role: msg.receiverId.role
        }
      })),
      hasNewMessages: messages.length > 0,
      lastMessageId: messages.length > 0 ? messages[messages.length - 1]._id : lastMessageId
    });

  } catch (error) {
    console.error('Poll messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}