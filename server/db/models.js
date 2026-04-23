import mongoose from 'mongoose';

const bilingualPromptSchema = new mongoose.Schema(
  { en: { type: String, required: true }, vi: { type: String, required: true } },
  { _id: false }
);

const imageHistorySchema = new mongoose.Schema({
  kol_filename:         { type: String, required: true },
  product_filename:     { type: String, required: true },
  kol_style:            { type: String, default: 'auto' },
  mood:                 { type: String, default: 'auto' },
  setting:              { type: String, default: 'auto' },
  pose_prompt:          { type: bilingualPromptSchema, required: true },
  motion_prompt:        { type: bilingualPromptSchema, required: true },
  continuation_prompt:  { type: bilingualPromptSchema, required: true },
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
