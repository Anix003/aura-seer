import mongoose from 'mongoose';

const analysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  inputMeta: {
    imageType: {
      type: String,
      required: [true, 'Image type is required'],
      trim: true,
      maxLength: [50, 'Image type cannot exceed 50 characters']
    },
    symptoms: {
      type: String,
      required: [true, 'Symptoms are required'],
      trim: true,
      maxLength: [1000, 'Symptoms description cannot exceed 1000 characters']
    }
  },
  aiOutput: {
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
      maxLength: [500, 'Diagnosis cannot exceed 500 characters']
    },
    confidence: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: [0, 'Confidence cannot be less than 0'],
      max: [1, 'Confidence cannot be greater than 1']
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
      maxLength: [1000, 'Recommendation cannot exceed 1000 characters']
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxLength: [1000, 'Additional info cannot exceed 1000 characters']
    }
  },
  clinicianAction: {
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'overridden'],
        message: 'Status must be pending, accepted, rejected, or overridden'
      },
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [1000, 'Clinician notes cannot exceed 1000 characters']
    }
  }
}, {
  timestamps: true
});

analysisResultSchema.index({ userId: 1, createdAt: -1 });
analysisResultSchema.index({ doctorId: 1 });
analysisResultSchema.index({ 'clinicianAction.status': 1 });
analysisResultSchema.index({ createdAt: -1 });

const AnalysisResult = mongoose.models.AnalysisResult || mongoose.model('AnalysisResult', analysisResultSchema);

export default AnalysisResult;