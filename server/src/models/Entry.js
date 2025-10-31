import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  type: { type: String },
  supply: { type: Number, default: 0 },
  retail: { type: Number, default: 0 },
  net: { type: Number, default: 0 },
});

const entrySchema = new mongoose.Schema(
  {
    kind: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String },
    coords: { latitude: Number, longitude: Number },
    stall: { type: String },
    papers: [paperSchema],
    data: { type: mongoose.Schema.Types.Mixed }, // flexible for other kinds
    submittedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Entry', entrySchema);
