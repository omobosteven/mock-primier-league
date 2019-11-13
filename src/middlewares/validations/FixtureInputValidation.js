import { validateAll, configure, validations } from 'indicative/validator';
import { sanitize } from 'indicative/sanitizer';
import CustomFormatter from './CustomErrorFormat';

configure({
    formatter: CustomFormatter
});

class FixtureInputValidation {
    static validateCreateFixtureInput(req, res, next) {
        const rules = {
            home_team: 'required|string',
            away_team: 'required|string|different:home_team',
            event_date: [
                validations.required(),
                validations.dateFormat(['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'])
            ]
        };

        const sanitizationSchema = {
            home_team: 'trim',
            away_team: 'trim',
            event_date: 'trim',
        };

        const inputData = req.body;


        const messages = {
            required: (field) => `${field} is required`,
            string: (field) => `${field} must be a string of team id`,
            dateFormat: (field) => {
                const message = `${field
                } should be in ISO8601 date (YYYY-MM-DD HH:mm) format`;
                return message;
            },
            different: () => 'home and away team cannot be the same'
        };

        sanitize(inputData, sanitizationSchema);
        validateAll(inputData, rules, messages)
            .then(() => {
                req.fixtureInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    status: 400,
                    errors: error
                });
            });
    }

    static validateUpdateFixtureInput(req, res, next) {
        const rules = {
            home_team: 'required_if:away_team|string',
            away_team: 'required_if:home_team|string|different:home_team',
            home_team_goal: 'integer|above:-1',
            away_team_goal: 'integer|above:-1',
            status: 'string|in:pending,completed',
            event_date: [
                validations.dateFormat(['YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm'])
            ]
        };

        const sanitizationSchema = {
            home_team: 'trim',
            away_team: 'trim',
            event_date: 'trim',
            status: 'trim|lower_case'
        };

        const messages = {
            string: (field) => `${field} must be a string`,
            integer: (field) => `${field} must be a number`,
            required_if: (field) => `${field} is required`,
            dateFormat: (field) => {
                const message = `${field
                } should be in ISO8601 date (YYYY-MM-DD HH:mm) format`;
                return message;
            },
            different: () => 'home and away team cannot be the same',
            'status.in': 'status can either be "pending" or "completed"'
        };

        const inputData = req.body;

        sanitize(inputData, sanitizationSchema);
        validateAll(inputData, rules, messages)
            .then(() => {
                req.fixtureInput = inputData;
                return next();
            })
            .catch((error) => {
                return res.status(400).send({
                    status: 400,
                    errors: error
                });
            });
    }
}

export default FixtureInputValidation;
