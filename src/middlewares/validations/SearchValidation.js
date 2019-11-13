class SearchValidation {
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
}

export default SearchValidation;
