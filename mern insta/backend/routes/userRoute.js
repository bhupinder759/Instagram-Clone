import express from 'express';
import { register } from '../controllers/usercontroller.js';
import upload from '../middlewares/multer.js';
import { login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow } from '../controllers/usercontroller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;