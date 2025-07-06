import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['video', 'image'],
      required: true,
      default: 'video',
    },
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
