import mongoose from 'mongoose';
import models from '../models';

const { User, Team, Fixture } = models;
const { ObjectId } = mongoose.Types;

class FindResource {
    static async findUser(email, username) {
        try {
            const user = await User.findOne({
                $or: [{ email }, { username }]
            });
            return user;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }

    static async findTeam(name, code) {
        try {
            const team = await Team.findOne({
                $or: [{ name }, { code }]
            });
            return team;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }

    static async findUserWithUsername(username) {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }

    static async findDocumentById(documentId, model) {
        try {
            const isValidId = ObjectId.isValid(documentId);

            if (isValidId) {
                const documentIdCasted = ObjectId(documentId);
                const document = await model.findOne({
                    _id: documentIdCasted
                })
                    .populate('home_team', 'name code')
                    .populate('away_team', 'name code');
                return document;
            }

            return null;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }

    static async findFixtureByHomeAwayIds(homeTeamId, awayTeamId) {
        try {
            const fixture = await Fixture.findOne({
                $and: [
                    { home_team: homeTeamId },
                    { away_team: awayTeamId },
                    { status: 'pending' }
                ]
            });

            return fixture;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }
}

export default FindResource;
