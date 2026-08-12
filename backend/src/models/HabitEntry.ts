import mongoose, { Schema, Document } from 'mongoose';

export interface IHabitEntry extends Document {
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  completed: boolean;
  value?: number | string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const habitEntrySchema = new Schema<IHabitEntry>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    value: {
      type: Schema.Types.Mixed
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for efficient queries
habitEntrySchema.index({ habitId: 1, date: 1 }, { unique: true });
habitEntrySchema.index({ userId: 1, date: 1 });

// Helper method to normalize date to start of day (UTC)
habitEntrySchema.pre('save', function (next) {
  if (this.date) {
    const normalized = new Date(this.date);
    normalized.setUTCHours(0, 0, 0, 0);
    this.date = normalized;
  }
  next();
});

export default mongoose.model<IHabitEntry>('HabitEntry', habitEntrySchema);
