import express from 'express';
import Authenticate from '../middlewares/Authentication';
import Checker from '../middlewares/Checker';
import FixtureInputValidation from
    '../middlewares/validations/FixtureInputValidation';
import FixtureController from '../controllers/FixtureController';

const fixture = express.Router();

const {
    verifyAdminRole,
    checkHomeAwayTeamExist,
    checkDuplicateFixture,
    verifyFixtureWithId
} = Checker;


const {
    checkTokenExist,
    verifyToken
} = Authenticate;

const {
    validateCreateFixtureInput,
    validateUpdateFixtureInput
} = FixtureInputValidation;

const {
    createFixture,
    updateFixture,
    getFixture,
    getAllFixtures,
    deleteFixture,
    getPendingCompletedFixtures
} = FixtureController;

fixture.use(checkTokenExist, verifyToken);

fixture.post('/',
    verifyAdminRole,
    validateCreateFixtureInput,
    checkHomeAwayTeamExist,
    checkDuplicateFixture,
    createFixture);

fixture.patch('/:fixture_id',
    verifyAdminRole,
    verifyFixtureWithId,
    validateUpdateFixtureInput,
    checkHomeAwayTeamExist,
    checkDuplicateFixture,
    updateFixture);

fixture.delete('/:fixture_id',
    verifyAdminRole,
    verifyFixtureWithId,
    deleteFixture);

fixture.get('/pending',
    getPendingCompletedFixtures,
    getAllFixtures);

fixture.get('/completed',
    getPendingCompletedFixtures,
    getAllFixtures);

fixture.get('/:fixture_id',
    verifyFixtureWithId,
    getFixture);

fixture.get('',
    getAllFixtures);

export default fixture;
