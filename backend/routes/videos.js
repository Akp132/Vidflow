import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import auth from '../middleware/auth.js';
import Video from '../models/Video.js';
import User from '../models/User.js';

const router = Router();

// Accept both video and image files
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Accept mp4, jpg, jpeg, png, webp
    const ext = file.originalname.split('.').pop().toLowerCase();
    let resource_type = 'video';
    let format = 'mp4';
    if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      resource_type = 'image';
      format = ext;
    }
    return {
      folder: 'strmly/uploads',
      resource_type,
      format,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|jpg|jpeg|png|webp/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only mp4, jpg, jpeg, png, webp files are allowed'));
    }
  },
});

router.post('/upload', auth, upload.single('file'), async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ msg: 'Title and media file are required.' });
    }
    // Determine mediaType
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const mediaType = ["jpg", "jpeg", "png", "webp"].includes(ext) ? 'image' : 'video';
    const video = new Video({
      uploader: req.user.id,
      title,
      description,
      url: req.file.path,
      mediaType,
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

// Get videos from users the current user follows
router.get('/following', auth, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(401).json({ msg: 'Unauthorized' });
    const followingIds = currentUser.following;
    if (!followingIds.length) return res.json([]);
    const videos = await Video.find({ uploader: { $in: followingIds } })
      .populate({ path: 'uploader', select: 'name' })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

// Get videos by specific user ID
router.get('/user/:id', async (req, res, next) => {
  try {
    const videos = await Video.find({ uploader: req.params.id })
      .populate({ path: 'uploader', select: 'name' })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

export default router;
