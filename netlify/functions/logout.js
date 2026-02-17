exports.handler = async () => {
  return {
    statusCode: 302,
    multiValueHeaders: {
      "Set-Cookie": [
        "discord_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0"
      ]
    },
    headers: {
      "Location": "/",
      "Cache-Control": "no-store"
    },
    body: ""
  };
};
