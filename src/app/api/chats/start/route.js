import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const userFromToken = await getUserFromCookies();
    if (!userFromToken) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await User.findById(userFromToken.userId);
    if (!user || user.role !== 'patient') {
      return Response.json(
        { error: 'Only patients can start chats' },
        { status: 403 }
      );
    }

    const { specialization } = await request.json();

    if (!specialization || specialization.trim() === '') {
      return Response.json(
        { error: 'Specialization is required' },
        { status: 400 }
      );
    }

    const doctor = await User.findOne({
      role: { $in: ['doctor', 'clinician'] },
      specialization: { $regex: specialization.trim(), $options: 'i' }
    }).sort({ createdAt: 1 });

    if (!doctor) {
      return Response.json(
        { error: `No ${specialization} specialist available at the moment. Please try again later.` },
        { status: 404 }
      );
    }

    const roomId = `${user._id}_${doctor._id}`;

    return Response.json({
      roomId,
      patient: {
        id: user._id,
        name: user.name,
        role: user.role
      },
      doctor: {
        id: doctor._id,
        name: doctor.name,
        role: doctor.role,
        specialization: doctor.specialization
      },
      message: `Chat room created with ${doctor.name} (${doctor.specialization})`
    }, { status: 201 });

  } catch (error) {
    console.error('Start chat error:', error);
    return Response.json(
      { error: 'Internal server error while starting chat' },
      { status: 500 }
    );
  }
}