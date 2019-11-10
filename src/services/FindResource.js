import mongoose from 'mongoose';
import models from '../models';

const { User, Team } = models;
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

    static async findTeamById(teamId) {
        try {
            const isValidId = ObjectId.isValid(teamId);

            if (isValidId) {
                const teamIdCasted = ObjectId(teamId);
                const team = await Team.findOne({
                    _id: teamIdCasted
                });
                return team;
            }

            return null;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }
}

export default FindResource;
