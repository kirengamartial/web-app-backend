import ContributorContent from '../models/contributorGalleryModel.js';
import cloudinary from '../helpers/cloundinary/cloudinary.js';
import upload from '../helpers/multer/galleryMulter.js'

export const createContributorContent = async(req, res) => {

  upload(req, res, async(err) => {
      if(err) {
          return res.status(400).json({err})
      }
  
      if (req.file === undefined) {
          return res.status(400).json({ err: 'Please select an image' });
        }
    
        try {
          const { room } = req.body;
          const userId = req.user._id;
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "SUGIRA_GALLERY"
          });
    
          const newContributorContent = await ContributorContent.create({
            userId,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            room
        });
    
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