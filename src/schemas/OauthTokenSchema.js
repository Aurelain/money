export default {
    $id: 'OauthTokenSchema',
    type: 'object',
    properties: {
        access_token: {
            type: 'string',
            minLength: 1,
        },
        expires_in: {
            type: 'number',
        },
        refresh_token: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['access_token', 'expires_in', 'refresh_token'],
};

/*
{
    "access_token": "ya29.a0AfB_byACgZg...g8-5h2...AD-Ek...71",
    "expires_in": 3599,
    "refresh_token": "1//09F...wF-L9...A0",
    "scope": "openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
    "token_type": "Bearer",
    "id_token": "eyJh...Q.ey...0fQ.aF...9P-BMT...gfO-_ag...IP-Ju...O9-oS...ID-YH...GA"
}
 */
