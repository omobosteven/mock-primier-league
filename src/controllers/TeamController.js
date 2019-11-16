import models from '../models';

const { Team } = models;

class TeamController {
    static async createTeam(req, res, next) {
        try {
            const teamData = req.teamInput;
            const team = new Team(teamData);
            team.save();

            return res.status(201).send({
                status: 201,
                message: 'team created successfully',
                data: team
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async editTeam(req, res, next) {
        try {
            const {
                name: nameInput, code: codeInput,
                venue_name: venueNameInput, venue_capacity: venueCapacityInput
            } = req.teamInput;

            const {
                id, name: nameData, code: codeData,
                venue_name: venueNameData, venue_capacity: venueCapacityData
            } = req.team;

            const teamUpdateData = {
                name: nameInput || nameData,
                code: codeInput || codeData,
                venue_name: venueNameInput || venueNameData,
                venue_capacity: venueCapacityInput || venueCapacityData
            };

            const team = await Team.findByIdAndUpdate(id, teamUpdateData, {
                new: true
            });
            team.save();

            return res.status(200).send({
                status: 200,
                message: 'team updated successfully',
                data: team
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static getTeam(req, res, next) {
        try {
            const data = req.team;

            return res.status(200).send({
                status: 200,
                message: 'team retrieved successfully',
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async getAllTeams(req, res, next) {
        try {
            const data = await Team.find();
            return res.status(200).send({
                status: 200,
                message: 'teams retrieved successfully',
                count: data.length,
                data
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }

    static async deleteTeam(req, res, next) {
        try {
            const { team } = req;

            await team.remove();

            return res.status(200).send({
                status: 200,
                message: 'team deleted successfully',
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }
}

export default TeamController;
