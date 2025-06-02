import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        //image upload to cloudinary
        const optimizeImageBuffer = await sharp(image.buffer)
            .resize({width: 800, height: 800, fit: 'inside'})
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data URI
        const fileUri = `data:image/jpg;base64,${optimizeImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: {
                image: cloudResponse.secure_url,
                author: authorId,
            }
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path: 'author', select: '-password -__v'});

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        .populate({path: 'author', select: 'username, profilePicture'})
        .populate({path: 'comments', 
            sort: { createdAt: -1 }, 
            populate: { path: 'author', 
            select: 'username, profilePicture' }})
        
        return res.status(200).json({
            success: true,
            posts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
        .populate({ path: 'author',
            select: 'username, profilePicture' 
        })
        .populate({ path: 'comments' ,
            sort: { createdAt: -1 }, 
            populate: { path: 'author', 
            select: 'username, profilePicture' }
        })

        return res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const likePost = async (req, res) => {
    try {
        const likeKarneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        await post.updateOne({
            $addToSet: { likes: likeKarneWalaUserKiId }  //add to set ensures no duplicates like ek id se ek like
        });

        await post.save();

        //implement socket io for real-time notification

        return res.status(200).json({
            success: true,
            message: 'Post liked successfully',
            post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const unlikePost = async (req, res) => {
    try {
        const likeHataneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        await post.updateOne({
            $pull: { likes: likeHataneWalaUserKiId }  //pull removes the id from likes
        });

        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Post unliked successfully',
            post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}