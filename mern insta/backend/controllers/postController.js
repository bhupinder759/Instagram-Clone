import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import { Comment } from '../models/commentModel.js';

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

export const dislikePost = async (req, res) => {
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

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentUserId = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = await Comment.create({
            text,
            author: commentUserId,
            post: postId
        }).populate({
            path: 'author',
            select: 'username, profilePicture'
        });

        post.comments.push( comment._id );
        await post.save();

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate({path: 'author', select:'username, profilePicture'});

        if (!comments) {
            return res.status(404).json({ success: false, message: 'Comments not found' });
        }

        return res.status(200).json({ success: true, comments });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const autherId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        //check if the login user insta qwner of the post
        if (post.author.toString() !== autherId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        //delete post
        await Post.findByIdAndDelete(postId);

        //remove the post id from the user post
        let user = await User.findById(autherId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const user = await User.findById(authorId);

        if (user.bookmarks.includes(postId._id)) {
            //already bookmarked
            await user.updateOne({ $pull: { bookmarks: postId._id }});
            await user.save();

            return res.status(200).json({ type:'unsaves', success: true, message: 'Post unbookmarked successfully' });
        } else {
            //bookmark
            await user.updateOne({ $push: { bookmarks: postId._id }});
            await user.save();

            return res.status(200).json({ type:'saved', success: true, message: 'Post bookmarked successfully' })
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}