import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role, specialization } = await request.json();

    if (!name || !email || !password || !role) {
      return Response.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    const validRoles = ['doctor', 'clinician', 'patient'];
    if (!validRoles.includes(role)) {
      return Response.json(
        { error: 'Role must be doctor, clinician, or patient' },
        { status: 400 }
      );
    }

    if ((role === 'doctor' || role === 'clinician') && !specialization) {
      return Response.json(
        { error: 'Specialization is required for doctors and clinicians' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role
    };

    if (specialization) {
      userData.specialization = specialization.trim();
    }

    const user = await User.create(userData);

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const response = Response.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialization: user.specialization
        }
      },
      { status: 201 }
    );

    return setAuthCookie(response, token);

  } catch (error) {
    console.error('Signup error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return Response.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Internal server error during signup' },
      { status: 500 }
    );
  }
}