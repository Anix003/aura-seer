import connectDB from '@/lib/db';
import AnalysisResult from '@/models/AnalysisResult';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const userFromToken = await getUserFromCookies();
    if (!userFromToken) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    let query = {};

    if (userFromToken.role === 'patient') {
      query.userId = userFromToken.userId;
    } else if (userFromToken.role === 'doctor' || userFromToken.role === 'clinician') {
      if (status) {
        query['clinicianAction.status'] = status;
      }
    } else {
      return Response.json(
        { error: 'Invalid user role' },
        { status: 403 }
      );
    }

    if (status && userFromToken.role === 'patient') {
      query['clinicianAction.status'] = status;
    }

    const skip = (page - 1) * limit;

    const results = await AnalysisResult.find(query)
      .populate('userId', 'name email role')
      .populate('doctorId', 'name email role specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AnalysisResult.countDocuments(query);

    return Response.json({
      results: results.map(result => ({
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
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}