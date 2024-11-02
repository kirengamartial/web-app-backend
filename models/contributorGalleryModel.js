import mongoose from 'mongoose';

const contributorContentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    image: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    room: { type: String, required: true }
});

const ContributorContent = mongoose.model('ContributorContent', contributorContentSchema);

export default ContributorContent;