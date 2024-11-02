import mongoose, { Schema } from "mongoose";

const testSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: [true, 'type is required']
    },
    score: {
        type: String,
        unique: true,
        required: [true,'score is required'],
    },
    result: {
        type: String,
        required: [true, 'result is required']
    }
},{timestamps: true})



const test = mongoose.model('Test', testSchema)

export default test