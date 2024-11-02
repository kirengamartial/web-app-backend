import mongoose, { Schema } from "mongoose";
import pkg from "validator";
import bcrypt from 'bcrypt'

const { isEmail } = pkg

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'email is required'],
        lowercase: true,
        validate: [isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        minLength: [6, 'Password must be at least 6 characters'],
        required: [true, 'password is required']
    },
    isAdmin: {
        type:Boolean,
        default: false
    },
    isContributor: {
        type:Boolean,
        default: false
    }
},{timestamps: true})


userSchema.pre('save',async function(next) {
 if(!this.isModified('password')) {
   next()
 }

 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const user = mongoose.model('User', userSchema)
export default user