const { parseCookies, cookie, createSessionCookie } = require("./_session");

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const code = qs.code;
    const state = qs.state;

    const headers = event.headers || {};
    const cookieHeader = headers.cookie || headers.Cookie || "";
    const cookies = parseCookies(cookieHeader);

    if (!code || !state || cookies.discord_oauth_state !== state) {
      return { statusCode: 400, body: "Invalid OAuth state" };
    }

    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const roleId = process.env.DISCORD_ROLE_ID;
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    const sessionSecret = process.env.SESSION_SECRET;

    if (!guildId || !botToken || !clientId || !clientSecret || !redirectUri || !sessionSecret) {
      return { statusCode: 500, body: "Missing env vars" };
    }

    // Troca code por access_token
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const token = await tokenRes.json();

    if (!tokenRes.ok || !token.access_token) {
      return { statusCode: 400, body: "Token exchange failed" };
    }

    const accessToken = token.access_token;

    // Pega usuário
    const meRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const me = await meRes.json();

    if (!meRes.ok || !me.id) {
      return { statusCode: 400, body: "User fetch failed" };
    }

    // Adiciona no servidor
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${me.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    // Aplica cargo
    if (roleId) {
      await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${me.id}/roles/${roleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      });
    }

    // Cria sessão
    const sessionValue = createSessionCookie(me, sessionSecret, 604800);

  return {
  statusCode: 302,
  multiValueHeaders: {
    "Set-Cookie": [
      cookie("discord_session", sessionValue, {
        maxAge: 604800,
        sameSite: "Lax",
        secure: true
      }),
      cookie("discord_oauth_state", "", {
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

  } catch (err) {
    return {
      statusCode: 500,
      body: "Server error: " + (err?.message || String(err))
    };
  }
};
