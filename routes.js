
const router = require('express').Router(),
    oauth = require('./oAuthServer'),
    Request = require('oauth2-server').Request,
    Response = require('oauth2-server').Response,
    API_URL = require('./config/api'),
    handleResponse = require('./utils').handleResponse,
    handleError = require('./utils').handleError,
    requestPromise = require('request-promise-native'),
    asyncWrapper = require('./middlewares/asyncWrapper'),
    getClient = require('./model').getClient,
    oAuthUser = require('./models').oAuthUser

const InvalidRequestError = require('oauth2-server').InvalidRequestError
const InvalidGrantError = require('oauth2-server').InvalidGrantError

router.post('/token', asyncWrapper(async (req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)
    try {
        const token = await oauth.token(request, response, { accessTokenLifetime: 3600 })
        console.log(token)
        token.type = "bearer"
        return res.status(200).json(token)
    }
    catch (error) {
        console.error(error)
        return res.status(err.status).json(error)
    }
}))

router.get('/authorize', asyncWrapper(async (req, res, next) => {
    try {
        if (!req.query.response_type) throw new InvalidRequestError("response_type is missing")
        if (!req.query.client_id) throw new InvalidRequestError("client_id is missing")
        if (!req.query.scope) throw new InvalidRequestError("the scope is missing")
        if (!req.query.redirect_uri) throw new InvalidRequestError("redirect_uri is missing")

        const client = await getClient(req.query.client_id)
        if (!client) {
            return res.status(400).send("Can't get client from this client_id")
        }
        return res.render('login', {
            client_name: client.name,
            redirect_uri: req.query.redirect_uri,
            client_id: req.query.client_id,
            scope: req.query.scope,
            response_type: req.query.response_type,
            state: req.query.state
        })
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

}))

router.post('/authorize', asyncWrapper(async (req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)
    const credential = req.body.credential
    const password = req.body.password

    const authHandler = {
        handle: (request, response) => {
            let endpoint = 'api/auth/login'
            return oAuthUser.findOne({ $or: [{ username: credential }, { email: credential }] }).lean()
                .then( user => {
                    endpoint += (user.loginType === 'ldap') ? '/polytech' : ''

                    const options = {
                        method: 'POST',
                        uri: `${API_URL}/${endpoint}`,
                        body: {
                            credential: credential,
                            password: password,
                        },
                        json: true
                    }

                    try {
                        return requestPromise(options).then( res => res.user).catch( err => err)
                    }
                    catch (err) {
                        return err;
                    }
                }).catch( error => {
                    throw new InvalidGrantError("Invalid credentials")
                })
        }
    }

    const option = {
        authenticateHandler: authHandler,
        accessTokenLifetime: 3600
    }

    return oauth.authorize(request, response, option)
        .then((code) => {
            res.locals.oauth = { code: code }
            if (code.accessToken) {
                return res.json({
                    accessToken: code.accessToken,
                    accessTokenExpiresAt: code.accessTokenExpiresAt,
                    token_type: "bearer"
                })
            } else {
                return handleResponse.call(this, req, res, response);
            }
        }).catch((err) => {
            // handle error condition
            return handleError.call(this, err, req, res, response, next);
        })
}))

router.all('/redirected', (req, res) => {
    res.json({code: req.query})
    res.end('You have been successfully redirected')
})


module.exports = router