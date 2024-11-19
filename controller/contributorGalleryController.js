import ContributorContent from '../models/contributorGalleryModel.js';
import cloudinary from '../helpers/cloundinary/cloudinary.js';
import upload from '../helpers/multer/galleryMulter.js'
import Comment from '../models/comment.js';
import User from '../models/userModel.js';
import Like from '../models/like.js';

export const createContributorContent = async(req, res) => {
  upload(req, res, async(err) => {
    if(err) {
      return res.status(400).json({err})
    }

    if (!req.file) {
      return res.status(400).json({ err: 'Please select an image or video' });
    }

    try {
      const { room, title, description } = req.body;
      const userId = req.user._id;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "SUGIRA_GALLERY",
        resource_type: "auto",
      });

      let newContributorContent;
      if (req.file.mimetype.startsWith('image/') || req.file.mimetype.startsWith('video/')) {
        newContributorContent = await ContributorContent.create({
          userId,
          mediaType: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
          media: {
            public_id: result.public_id,
            url: result.secure_url
          },
          room, 
          title,
          description
        });
      } else {
        return res.status(400).json({ err: 'Invalid file type. Please upload an image or video.' });
      }

      return res.status(200).json({
        message: 'Created gallery successfully',
        newContributorContent
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  })
}
  

export const getContributorContent = async (req, res) => {
    try {
        const userId = req.user._id;
        const contributorContent = await ContributorContent.find({ userId });

        res.status(200).json({
            success: true,
            data: contributorContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch contributor content'
        });
    }
};

export const getContent = async(req, res) => {
  try {
    const contributorContent = await ContributorContent.find();

    res.status(200).json({
        success: true,
        data: contributorContent
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch contributor content'
    });
}
}
export const getSingleContent = async (req, res) => {
  try {
    const { id } = req.params;

    const contributorContent = await ContributorContent.findById(id);

    if (!contributorContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contributorContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch contributor content',
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { contentId } = req.params; // Content ID from the URL
    const { comment } = req.body; // Comment text from the body
    const userId = req.user._id; // User ID from the authenticated request

    // Find the user's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create the comment
    const newComment = await Comment.create({
      contentId,
      userId,
      name: user.name,
      comment,
    });

    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create comment',
    });
  }
};

// Get comments for a specific content
export const getCommentsByContentId = async (req, res) => {
  try {
    const { contentId } = req.params; // Content ID from the URL

    // Find comments for the given content ID
    const comments = await Comment.find({ contentId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
      message: `Comments for content ID ${contentId} retrieved successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch comments',
    });
  }
};


export const createLike = async (req, res) => {
  try {
    const { contentId } = req.params; // Content ID from URL
    const userId = req.user._id; // User ID from authenticated request

    // Check if the user has already liked the content
    const existingLike = await Like.findOne({ contentId, userId });
    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this content.',
      });
    }

    // Create a new like
    const newLike = await Like.create({
      contentId,
      userId,
      like: 1, // Default value
    });

    res.status(201).json({
      success: true,
      data: newLike,
      message: 'Content liked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to like content',
    });
  }
};

// Get likes for a specific content
export const getLikesByContentId = async (req, res) => {
  try {
    const { contentId } = req.params; // Content ID from URL

    // Find all likes for the given content ID
    const likes = await Like.find({ contentId });

    // Count the total number of likes
    const totalLikes = likes.reduce((sum, like) => sum + like.like, 0);

    res.status(200).json({
      success: true,
      data: { totalLikes, likes },
      message: `Likes for content ID ${contentId} retrieved successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch likes',
    });
  }
};
