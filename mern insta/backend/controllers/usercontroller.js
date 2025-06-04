import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/postModel.js';

export const register = async (req, res) => {
    try {
        const { username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({success: false, message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({success: false, message: 'User already exists' });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({success: true, message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({success: false, message: 'All fields are required' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({success: false, message: 'User does not exist' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });

        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if (post.auther.equals(user._id)) {
                    return post;
                }
                return null;    
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        }

        return res.cookie('token', token, {
            httpOnly:true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
            success: true,
            message: 'Login successful',
            user,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
    try {
        return res.clearCookie('token').json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({success: false, message: 'User ID is required' });
        }

        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found' });
        }

        return res.status(200).json({success: true, user });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found' });
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        // const suggestedUsers = await User.aggregate([
        //     { $match: { _id: { $ne: req.id } } }, // Exclude the current user
        //     { $sample: { size: 5 } }, // Randomly select 5 users
        //     {
        //         $project: {
        //             _id: 1,
        //             username: 1,
        //             profilePicture: 1,
        //             bio: 1,
        //         }
        //     }
        // ]);
        // return res.status(200).json({success: true, suggestedUsers });

        const suggestedUsers = await User.find({ _id: { $ne: req.id }}).select("-password");
        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(404).json({success: false, message: 'No suggested users found' });
        }
        return res.status(200).json({success: true, users: suggestedUsers });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; //me
        const jiskoFollowKarunga = req.params.id; //jisko follow karunga
        if (followKrneWala === jiskoFollowKarunga) {
            return res.status(400).json({success: false, message: 'You cannot follow yourself' });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if (!user || !targetUser) {
            return res.status(404).json({success: false, message: 'User not found' });
        }

        // Check if already following
        const isFollowing = user.following.includes(jiskoFollowKarunga);
        if (isFollowing) {
            //Unfollow
            User.updateOne({ _id: followKrneWala },
                { $pull: { following: jiskoFollowKarunga } }
            ),
            User.updateOne({ _id: jiskoFollowKarunga },
                { $pull: { followers: followKrneWala } }
            )
            return res.status(200).json({success: true, message: 'Unfollowed successfully' });
        } else {
            //Follow
            await Promise.all([
                User.updateOne({ _id: followKrneWala },
                    { $push: { following: jiskoFollowKarunga } }
                ),
                User.updateOne({ _id: jiskoFollowKarunga }, { $push: { followers: followKrneWala } })
            ]);
            return res.status(200).json({success: true, message: 'Followed successfully' });
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' });
    }
}

