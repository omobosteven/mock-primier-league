import models from '../models';

const { Fixture, Team } = models;

class SearchController {
    static async searchTeamFixtures(req, res, next) {
        try {
            const { q: searchParam } = req.query;
            const query = {
                name: {
                    $regex: searchParam,
                    $options: 'i'
                }
            };

            const teams = await Team.find(query);
            const teamIds = teams.map((team) => {
                return team.id;
            });

            const fixtures = await Fixture.find({
                $or: [
                    { home_team: teamIds },
                    { away_team: teamIds }
                ]
            })
                .populate({
                    path: 'home_team',
                    select: 'name code',
                })
                .populate({
                    path: 'away_team',
                    select: 'name code'
                });

            return res.status(200).send({
                status: 200,
                data: {
                    teams,
                    fixtures
                }
            });
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    }
}

export default SearchController;
