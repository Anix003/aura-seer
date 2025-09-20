import connectDB from '@/lib/db';
import AnalysisResult from '@/models/AnalysisResult';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';
import { MOCK_DATA } from "@/lib/constants";

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
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'patient') {
      return Response.json(
        { error: 'Only patients can submit analysis requests' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");
    const symptoms = formData.get("symptoms");
    const imageType = formData.get("imageType") || "X-ray";

    if (!symptoms || symptoms.trim() === '') {
      return Response.json(
        { error: 'Symptoms description is required' },
        { status: 400 }
      );
    }

    if (!image) {
      return Response.json(
        { error: 'Medical image is required' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResult = MOCK_DATA.ANALYSIS_RESULTS[
      Math.floor(Math.random() * MOCK_DATA.ANALYSIS_RESULTS.length)
    ];

    const analysisResult = await AnalysisResult.create({
      userId: user._id,
      inputMeta: {
        imageType: imageType.trim(),
        symptoms: symptoms.trim()
      },
      aiOutput: {
        diagnosis: mockResult.diagnosis,
        confidence: mockResult.confidence,
        recommendation: mockResult.recommendation,
        additionalInfo: mockResult.additionalInfo
      },
      clinicianAction: {
        status: 'pending',
        notes: ''
      }
    });

    await analysisResult.populate('userId', 'name email role');

    return Response.json({
      id: analysisResult._id,
      diagnosis: analysisResult.aiOutput.diagnosis,
      confidence: analysisResult.aiOutput.confidence,
      recommendation: analysisResult.aiOutput.recommendation,
      additionalInfo: analysisResult.aiOutput.additionalInfo,
      status: analysisResult.clinicianAction.status,
      createdAt: analysisResult.createdAt,
      patient: {
        id: analysisResult.userId._id,
        name: analysisResult.userId.name,
        email: analysisResult.userId.email
      }
    });

  } catch (error) {
    console.error("Predict API Error:", error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Internal server error during image analysis" },
      { status: 500 }
    );
  }
}
