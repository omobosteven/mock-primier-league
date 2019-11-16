import express from 'express';
import QueryValidation from '../middlewares/validations/QueryValidation';
import SearchController from '../controllers/SearchController';

const search = express.Router();

const {
    searchTeamFixtures
} = SearchController;

const {
    validateSearchQuery
} = QueryValidation;

search.get('',
    validateSearchQuery,
    searchTeamFixtures);

export default search;
