import mongoose from 'mongoose';

const { Schema } = mongoose;

const fixtureSchema = new Schema({
    home_team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    away_team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    home_team_goal: {
        type: Number,
        required: true,
        default: 0
    },
    away_team_goal: {
        type: Number,
        required: true,
        default: 0
    },
    event_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    event_link: {
        type: String,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;
