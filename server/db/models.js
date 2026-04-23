import mongoose from 'mongoose';

const imageHistorySchema = new mongoose.Schema({
  kol_filename:         { type: String, required: true },
  product_filename:     { type: String, required: true },
  pose_prompt:          { type: String, required: true },
  motion_prompt:        { type: String, required: true },
  continuation_prompt:  { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } });

const videoSegmentSchema = new mongoose.Schema({
  segment_index: Number,
  start_time:    Number,
  end_time:      Number,
  motion_prompt: String,
}, { _id: false });

const videoHistorySchema = new mongoose.Schema({
  video_filename:   { type: String, required: true },
  segment_duration: { type: Number, required: true },
  segments:         [videoSegmentSchema],
}, { timestamps: { createdAt: 'created_at' } });

export const ImageHistory = mongoose.model('ImageHistory', imageHistorySchema);
export const VideoHistory = mongoose.model('VideoHistory', videoHistorySchema);
