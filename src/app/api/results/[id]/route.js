import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AnalysisResult from '@/models/AnalysisResult';
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

    const { id } = params;

    const result = await AnalysisResult.findById(id)
      .populate('userId', 'name email role')
      .populate('doctorId', 'name email role specialization');

    if (!result) {
      return NextResponse.json(
        { error: 'Analysis result not found' },
        { status: 404 }
      );
    }

    if (userFromToken.role === 'patient') {
      if (result.userId._id.toString() !== userFromToken.userId) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      id: result._id,
      inputMeta: result.inputMeta,
      aiOutput: result.aiOutput,
      clinicianAction: result.clinicianAction,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      patient: {
        id: result.userId._id,
        name: result.userId.name,
        email: result.userId.email
      },
      doctor: result.doctorId ? {
        id: result.doctorId._id,
        name: result.doctorId.name,
        specialization: result.doctorId.specialization
      } : null
    });

  } catch (error) {
    console.error('Get result by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const userFromToken = await getUserFromCookies();
    if (!userFromToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (userFromToken.role !== 'doctor' && userFromToken.role !== 'clinician') {
      return NextResponse.json(
        { error: 'Only doctors and clinicians can update analysis results' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status, notes } = await request.json();

    const validStatuses = ['pending', 'accepted', 'rejected', 'overridden'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, accepted, rejected, or overridden' },
        { status: 400 }
      );
    }

    const updateData = {
      'clinicianAction.status': status,
      'clinicianAction.notes': notes || '',
      doctorId: userFromToken.userId,
      updatedAt: new Date()
    };

    const result = await AnalysisResult.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email role')
      .populate('doctorId', 'name email role specialization');

    if (!result) {
      return NextResponse.json(
        { error: 'Analysis result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result._id,
      inputMeta: result.inputMeta,
      aiOutput: result.aiOutput,
      clinicianAction: result.clinicianAction,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      patient: {
        id: result.userId._id,
        name: result.userId.name,
        email: result.userId.email
      },
      doctor: result.doctorId ? {
        id: result.doctorId._id,
        name: result.doctorId.name,
        specialization: result.doctorId.specialization
      } : null
    });

  } catch (error) {
    console.error('Update result error:', error);

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