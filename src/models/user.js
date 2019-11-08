import mongoose from 'mongoose';
import Utils from '../utilities/utils';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const hashedPassword = await Utils.hashPassword(this.password);
    this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);

export default User;
