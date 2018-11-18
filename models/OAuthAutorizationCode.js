const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAuthorizationCode = new Schema({
    authorizationCode: String,
    expiresOn: Date,
    redirectUri: String,
    scope: String,
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})


mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCode);
const oAuthAuthorizationCode = mongoose.model('OAuthAuthorizationCode');

oAuthAuthorizationCode.getAuthorizationCode = async (authorizationCode) => {
    try {
        const code = await oAuthAuthorizationCode.findOne({ authorizationCode: authorizationCode }).lean()
        return code
    } catch(error) {
        throw error
    }
}

oAuthAuthorizationCode.revokeAuthorizationCode = async (code) => {
    await code.remove()
    return true
}

oAuthAuthorizationCode.saveAuthorizationCode = async (authorizationCode, client, user) => {
    var autorizeCode = new oAuthAuthorizationCode({
        authorizationCode: authorizationCode.authorizationCode,
        redirectUri: authorizationCode.redirectUri,
        expiresOn: authorizationCode.expiresAt,
        scope: authorizationCode.scope,
        client: client._id,
        user: user.id
    })

    return await autorizeCode.save()
}

module.exports = oAuthAuthorizationCode
