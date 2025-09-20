import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['doctor', 'clinician', 'patient'],
      message: 'Role must be either doctor, clinician, or patient'
    }
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor' || this.role === 'clinician';
    },
    trim: true,
    maxLength: [100, 'Specialization cannot exceed 100 characters']
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      return ret;
    }
  }
});

// Index for better performance
userSchema.index({ role: 1 });
userSchema.index({ specialization: 1 });

// Prevent re-compilation during hot reloads in development
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;