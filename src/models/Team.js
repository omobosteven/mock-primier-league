import mongoose from 'mongoose';

const { Schema } = mongoose;

const teamSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    code: {
        type: String,
        unique: true,
        uppercase: true,
        required: true
    },
    venue_name: {
        type: String,
        lowercase: true,
        required: true
    },
    venue_capacity: {
        type: Number,
        required: true
    }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Team = mongoose.model('Team', teamSchema);

export default Team;