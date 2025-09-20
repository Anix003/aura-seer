import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const userFromToken = await getUserFromCookies();
    if (!userFromToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId } = params;

    const [patientId, doctorId] = roomId.split('_');
    if (userFromToken.userId !== patientId && userFromToken.userId !== doctorId) {
      return NextResponse.json(
        { error: 'Access denied to this chat room' },
        { status: 403 }
      );
    }

    const messages = await Chat.find({ roomId })
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role')
      .sort({ timestamp: 1 })
      .limit(100);

    return NextResponse.json({
      roomId,
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
      }))
    });

  } catch (error) {
    console.error('Get chat messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();

    const userFromToken = await getUserFromCookies();
    if (!userFromToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId } = params;
    const { message } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const [patientId, doctorId] = roomId.split('_');
    if (userFromToken.userId !== patientId && userFromToken.userId !== doctorId) {
      return NextResponse.json(
        { error: 'Access denied to this chat room' },
        { status: 403 }
      );
    }

    const receiverId = userFromToken.userId === patientId ? doctorId : patientId;

    const chatMessage = await Chat.create({
      roomId,
      senderId: userFromToken.userId,
      receiverId,
      message: message.trim(),
      timestamp: new Date(),
      seen: false
    });

    await chatMessage.populate('senderId', 'name role');
    await chatMessage.populate('receiverId', 'name role');

    return NextResponse.json({
      id: chatMessage._id,
      message: chatMessage.message,
      timestamp: chatMessage.timestamp,
      seen: chatMessage.seen,
      sender: {
        id: chatMessage.senderId._id,
        name: chatMessage.senderId.name,
        role: chatMessage.senderId.role
      },
      receiver: {
        id: chatMessage.receiverId._id,
        name: chatMessage.receiverId.name,
        role: chatMessage.receiverId.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Send chat message error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}