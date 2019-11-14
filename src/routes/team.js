import express from 'express';
import Authenticate from '../middlewares/Authentication';
import Checker from '../middlewares/Checker';
import TeamInputValidation from
    '../middlewares/validations/TeamInputValidation';
import TeamController from '../controllers/TeamController';
import limiter from '../middlewares/rateLimit';

const team = express.Router();

const {
    verifyAdminRole,
    checkExistingTeam,
    verifyTeamWithId
} = Checker;

const {
    checkTokenExist,
    verifyToken
} = Authenticate;

const {
    validateCreateTeamInput,
    validateUpdateTeamInput
} = TeamInputValidation;

const {
    createTeam,
    editTeam,
    getTeam,
    getAllTeams,
    deleteTeam
} = TeamController;

team.use(checkTokenExist, verifyToken);

team.post('',
    verifyAdminRole,
    validateCreateTeamInput,
    checkExistingTeam,
    createTeam);

team.patch('/:team_id',
    verifyAdminRole,
    verifyTeamWithId,
    validateUpdateTeamInput,
    checkExistingTeam,
    editTeam);

team.delete('/:team_id',
    verifyAdminRole,
    verifyTeamWithId,
    deleteTeam);

team.get('/:team_id',
    limiter,
    verifyTeamWithId,
    getTeam);

team.get('',
    limiter,
    getAllTeams);

export default team;
