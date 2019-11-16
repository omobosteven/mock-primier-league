class QueryValidation {
    static validateSearchQuery(req, res, next) {
        const { q } = req.query;

        if (!q) {
            return res.status(400).send({
                status: 400,
                message: 'please enter a search parameter "?q=keyword"'
            });
        }

        return next();
    }

    static validateFixturesQueryParams(req, res, next) {
        const { status } = req.query;
        const validQueryParameter = ['pending', 'completed'];

        if (status && validQueryParameter.includes(status.toLowerCase())) {
            req.query = {
                status: status.toLowerCase()
            };
            return next();
        }

        return next();
    }
}

export default QueryValidation;
