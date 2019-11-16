import mongoose from 'mongoose';
import Helper from '../helpers/Helper';

const { Schema } = mongoose;

const {
    hashPassword
} = Helper;

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

userSchema.pre('save', async function (next) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
});

const User = mongoose.model('User', userSchema);

export default User;
