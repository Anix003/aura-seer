import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = await getUserFromCookies();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return new Response('Room ID is required', { status: 400 });
    }

    const [patientId, doctorId] = roomId.split('_');
    if (user.userId !== patientId && user.userId !== doctorId) {
      return new Response('Access denied', { status: 403 });
    }

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        const data = `data: ${JSON.stringify({
          type: 'connected',
          message: 'Connected to chat room',
          roomId,
          userId: user.userId
        })}\n\n`;
        
        controller.enqueue(encoder.encode(data));

        const interval = setInterval(async () => {
          try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const newMessages = await Chat.find({
              roomId,
              timestamp: { $gte: fiveMinutesAgo }
            })
            .populate('senderId', 'name role')
            .populate('receiverId', 'name role')
            .sort({ timestamp: -1 })
            .limit(10);

            if (newMessages.length > 0) {
              const data = `data: ${JSON.stringify({
                type: 'new_messages',
                messages: newMessages.map(msg => ({
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
              })}\n\n`;
              
              controller.enqueue(encoder.encode(data));
            }

            const heartbeat = `data: ${JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            })}\n\n`;
            
            controller.enqueue(encoder.encode(heartbeat));

          } catch (error) {
            console.error('SSE polling error:', error);
            const errorData = `data: ${JSON.stringify({
              type: 'error',
              message: 'Failed to fetch messages'
            })}\n\n`;
            
            controller.enqueue(encoder.encode(errorData));
          }
        }, 2000);

        request.signal?.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    });

  } catch (error) {
    console.error('SSE setup error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST() {
  return new Response(JSON.stringify({
    error: 'WebSocket connections cannot be established via HTTP POST',
    suggestion: 'Use a Socket.IO client library to connect to this endpoint'
  }), { 
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}