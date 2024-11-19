import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContributorContent', // Reference to your content model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your user model
    required: true,
    unique: true, // Prevent duplicate likes by the same user
  },
  like: {
    type: Number,
    default: 1, // Default value for a "like"
  },
}, { timestamps: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
