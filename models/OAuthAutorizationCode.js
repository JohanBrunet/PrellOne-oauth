const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthAuthorizationCode = new Schema({
    authorizationCode: String,
    expiresAt: Date,
    redirect_uri: String,
    scope: String,
    client: { 
        id: { type: String }
    },
    user: { type: Object }
})


mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCode);
const oAuthAuthorizationCode = mongoose.model('OAuthAuthorizationCode');

oAuthAuthorizationCode.getAuthorizationCode = async (authorizationCode) => {
    try {
        const code = await oAuthAuthorizationCode.findOne({ authorizationCode: authorizationCode })
        return code
    } catch(error) {
        throw error
    }
}

oAuthAuthorizationCode.revokeAuthorizationCode = async (code) => {
    console.log(code)
    await code.remove()
    return true
}

oAuthAuthorizationCode.saveAuthorizationCode = async (authorizationCode, client, user) => {
    var autorizeCode = new oAuthAuthorizationCode({
        authorizationCode: authorizationCode.authorizationCode,
        redirect_ri: authorizationCode.redirectUri,
        expiresAt: authorizationCode.expiresAt,
        scope: authorizationCode.scope,
        client: {
            id: client.id
        },
        user: user
    })

    return await autorizeCode.save()
}

module.exports = oAuthAuthorizationCode
