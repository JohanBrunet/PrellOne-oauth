const oAuthServer = require('oauth2-server')

const oauth = new oAuthServer({
    model: require('./model'),
    grants: ['password', 'authorization_code'],
    requireClientAuthentication: {password: false},
    continueAfterResponse: false,
    debug: true
})

module.exports = oauth