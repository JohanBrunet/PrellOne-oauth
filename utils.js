const UnauthorizedRequestError = require('oauth2-server').UnauthorizedRequestError

module.exports.handleResponse = (req, res, response) => {
    if (response.status === 302) {
        var location = response.headers.location;
        delete response.headers.location;
        res.set(response.headers);
        res.redirect(location);
    } else {
        res.set(response.headers);
        res.status(response.status).send(response.body);
    }
};

module.exports.handleError = (e, req, res, response, next) => {

    console.log("ERREUR")
    console.log(e)
    if (this.useErrorHandler === true) {
        next(e);
    } else {
        if (response) {
            res.set(response.headers);
        }

        res.status(e.code);

        if (e instanceof UnauthorizedRequestError) {
            return res.send();
        }

        res.status(400).send({ error: e.name, error_description: e.message });
    }
}