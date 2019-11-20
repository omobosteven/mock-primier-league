import express from 'express';
import Authenticate from '../middlewares/Authentication';
import Checker from '../middlewares/Checker';
import FixtureInputValidation from
    '../middlewares/validations/FixtureInputValidation';
import QueryValidation from '../middlewares/validations/QueryValidation';
import FixtureController from '../controllers/FixtureController';
import limiter from '../middlewares/rateLimit';

const fixture = express.Router();

const {
    verifyAdminRole,
    checkHomeAwayTeamExist,
    checkPendingFixture,
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
    validateFixturesQueryParams
} = QueryValidation;

const {
    createFixture,
    updateFixture,
    getFixture,
    getAllFixtures,
    deleteFixture,
} = FixtureController;

fixture.use(checkTokenExist, verifyToken);

fixture.post('/',
    verifyAdminRole,
    validateCreateFixtureInput,
    checkHomeAwayTeamExist,
    checkPendingFixture,
    createFixture);

fixture.patch('/:fixture_id',
    verifyAdminRole,
    verifyFixtureWithId,
    validateUpdateFixtureInput,
    checkHomeAwayTeamExist,
    checkPendingFixture,
    updateFixture);

fixture.delete('/:fixture_id',
    verifyAdminRole,
    verifyFixtureWithId,
    deleteFixture);

fixture.get('/:fixture_id',
    limiter,
    verifyFixtureWithId,
    getFixture);

fixture.get('/*-vs-*/:fixture_id',
    limiter,
    verifyFixtureWithId,
    getFixture);

fixture.get('',
    limiter,
    validateFixturesQueryParams,
    getAllFixtures);

export default fixture;
