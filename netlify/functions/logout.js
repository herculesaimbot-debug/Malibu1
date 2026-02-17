const { cookie } = require("./_session");

exports.handler = async () => {
  return {
    statusCode: 302,
    multiValueHeaders: {
      "Set-Cookie": [
        cookie("discord_session", "", {
          maxAge: 0,
          sameSite: "Lax",
          secure: true
        })
      ]
    },
    headers: {
      "Location": "/",
      "Cache-Control": "no-store"
    },
    body: ""
  };
};
