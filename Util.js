const createError = require('http-errors');

module.exports.setHeaderLocation = function (req, res, next) {
    res.header('Location',
        req.protocol + '://' + req.hostname + ':' + req.app.settings.port + req.baseUrl + '/' + req.body.name);
    res.status(201).end();
};

module.exports.checkName = function (req, res, next) {
    const requestedName = req.body.name;
    if (!requestedName) {
        // Malformed request
        return next(createError.BadRequest());
    }
    next();
};