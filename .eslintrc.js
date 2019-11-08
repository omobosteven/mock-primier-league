module.exports = {
    "extends": "airbnb-base",

    "env": {
        "commonjs": true,
        "node": true,
        "jest": true,
        "es6": true,
    },

    "rules": {
        "no-console": 0,
        "indent": ["error", 4],
        "no-param-reassign": [2, {"props": false}],
        "prefer-destructuring": 0,
        "arrow-body-style": 0,
        "comma-dangle": 0,
        "max-len": ["error", { "code": 80 }],
        "import/no-unresolved": [2, {
            "commonjs": true
        }]
    }
};
