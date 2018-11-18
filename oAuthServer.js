const oAuthServer = require('oauth2-server')

const oauth = new oAuthServer({
    model: require('./model'),
    grants: ['password', 'authorization_code']
    // debug: true
})

module.exports = oauth