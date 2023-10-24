export default {
    $id: 'OauthCodeSchema',
    type: 'object',
    properties: {
        code: {
            type: 'string',
            minLength: 1,
        },
        scope: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['code', 'scope'],
};

/*
{
    code: '4/0AdxxxxxxxxxxxxxxxxOh-3Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3r-oExxxxxxxxxQ',
    "scope": "email https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.email",
    "authuser": "0",
    "prompt": "consent"
}
 */
