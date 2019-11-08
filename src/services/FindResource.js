import models from '../models';

const { User } = models;

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

    static async findUserWithUsername(username) {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            /* istanbul ignore next */
            return error;
        }
    }
}

export default FindResource;
