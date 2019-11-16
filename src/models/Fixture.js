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

fixtureSchema.index({ home_team: 1, away_team: 1 }, {
    unique: true,
    partialFilterExpression: { status: 'pending' }
});

fixtureSchema.pre('find', function (next) {
    this
        .populate({ path: 'home_team', select: 'name code' })
        .populate({ path: 'away_team', select: 'name code' });
    next();
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

export default Fixture;
