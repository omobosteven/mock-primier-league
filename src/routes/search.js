import express from 'express';
import SearchValidation from '../middlewares/validations/SearchValidation';
import SearchController from '../controllers/SearchController';

const search = express.Router();

const {
    searchTeamFixtures
} = SearchController;

const {
    validateSearchQuery
} = SearchValidation;

search.get('',
    validateSearchQuery,
    searchTeamFixtures);

export default search;
