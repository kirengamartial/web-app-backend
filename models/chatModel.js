import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    name: {
        type: String,
        required: [true, 'type is required']
    },
    room: {
        type: String,
        unique: true,
        required: [true,'score is required'],
    },
    content: {
        type: String,
        required: [true, 'result is required']
    }
},{timestamps: true})



const chat = mongoose.model('Chat', chatSchema)

export default chat