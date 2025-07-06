import { Router } from 'express';
import User from '../models/User.js';
import Video from '../models/Video.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get public profile by user id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const uploads = await Video.find({ uploader: user._id }).sort({ createdAt: -1 });
    res.json({ user, uploads });
  } catch (err) {
    next(err);
  }
});

// Follow a user
router.post('/:id/follow', auth, async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ msg: 'Cannot follow yourself' });
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToFollow || !currentUser) return res.status(404).json({ msg: 'User not found' });
    if (userToFollow.followers.includes(currentUser._id)) return res.status(400).json({ msg: 'Already following' });
    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);
    await userToFollow.save();
    await currentUser.save();
    res.json({ msg: 'Followed', followers: userToFollow.followers.length });
  } catch (err) {
    next(err);
  }
});

// Unfollow a user
router.delete('/:id/unfollow', auth, async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ msg: 'Cannot unfollow yourself' });
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToUnfollow || !currentUser) return res.status(404).json({ msg: 'User not found' });
    userToUnfollow.followers = userToUnfollow.followers.filter(f => f.toString() !== currentUser._id.toString());
    currentUser.following = currentUser.following.filter(f => f.toString() !== userToUnfollow._id.toString());
    await userToUnfollow.save();
    await currentUser.save();
    res.json({ msg: 'Unfollowed', followers: userToUnfollow.followers.length });
  } catch (err) {
    next(err);
  }
});

// Get followers/following for a user
router.get('/:id/followers', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.followers);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/following', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.following);
  } catch (err) {
    next(err);
  }
});

export default router;
