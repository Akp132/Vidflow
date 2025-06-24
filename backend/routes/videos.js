import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import auth from '../middleware/auth.js';
import Video from '../models/Video.js';
import User from '../models/User.js';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'strmly/videos',
    resource_type: 'video',
    format: async (req, file) => 'mp4',
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ msg: 'Title and video file are required.' });
    }
    const video = new Video({
      uploader: req.user.id,
      title,
      description,
      url: req.file.path,
    });
    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const videos = await Video.find()
      .populate({ path: 'uploader', select: 'name' })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

export default router;
