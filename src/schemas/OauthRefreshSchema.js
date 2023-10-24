export default {
    $id: 'OauthRefreshSchema',
    type: 'object',
    properties: {
        access_token: {
            type: 'string',
            minLength: 1,
        },
        expires_in: {
            type: 'number',
        },
    },
    required: ['access_token', 'expires_in'],
};

/*
{
    "access_token": "ya29.a0Af...0173",
    "expires_in": 3599,
    "scope": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email openid",
    "token_type": "Bearer",
    "id_token": "eyJh...3w"
}
 */
