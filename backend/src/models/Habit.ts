import mongoose, { Schema, Document } from 'mongoose';

export type HabitCategory = 'workout' | 'nutrition' | 'spiritual' | 'personal' | 'other';
export type HabitType = 'boolean' | 'numeric' | 'duration' | 'text';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target?: number;
  unit?: string;
  frequency: HabitFrequency;
  reminderTime?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      minlength: [2, 'Habit name must be at least 2 characters'],
      maxlength: [100, 'Habit name cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true
    },
    category: {
      type: String,
      enum: ['workout', 'nutrition', 'spiritual', 'personal', 'other'],
      required: true,
      default: 'other'
    },
    type: {
      type: String,
      enum: ['boolean', 'numeric', 'duration', 'text'],
      required: true,
      default: 'boolean'
    },
    target: {
      type: Number,
      min: [0, 'Target must be positive']
    },
    unit: {
      type: String,
      maxlength: [20, 'Unit cannot exceed 20 characters'],
      trim: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
      default: 'daily'
    },
    reminderTime: {
      type: String,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
habitSchema.index({ userId: 1, active: 1 });

export default mongoose.model<IHabit>('Habit', habitSchema);
