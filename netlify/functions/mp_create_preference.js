const mercadopago = require("mercadopago");
const { verifySessionCookie, parseCookies } = require("./_session");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const PRODUCTS = [
  { id:"vip_bronze", price:23.99, title:"VIP Bronze (30 dias)" },
  { id:"vip_prata", price:28.99, title:"VIP Prata (30 dias)" },
  { id:"vip_ouro", price:33.99, title:"VIP Ouro (30 dias)" },
  { id:"vip_platina", price:38.99, title:"VIP Platina (30 dias)" },
  { id:"vip_diamante", price:48.99, title:"VIP Diamante (30 dias)" },
  
  { id:"coins_1m", price:20.00, title:"1.000.000" },
  { id:"coins_2m", price:35.00, title:"2.000.000" },
  { id:"coins_3m", price:50.00, title:"3.000.000" },
  { id:"coins_10m", price:75.00, title:"10.000.000" },

  { id:"level_50", price:30.00, title:"Level 50" },
  { id:"level_100", price:43.00, title:"Level 100" },
  { id:"level_150", price:60.00, title:"Level 150" },
  { id:"level_200", price:75.00, title:"Level 200" },

  { id:"org_police", price:35.90, title:"Organização policial" },
  { id:"org_crime", price:35.90, title:"Organização criminosa" },
  { id:"org_medic", price:35.90, title:"Organização médico" },
  { id:"org_mechanic", price:45.90, title:"Organização mecânico" },

  { id:"unban_serial", price:100.00, title:"Desban Serial" },
  { id:"unban_account", price:50.00, title:"Desban Conta" },
  { id:"unban_discord", price:14.99, title:"Desban Discord" },
];

exports.handler = async (event) => {
  try {

    const cookies = parseCookies(event.headers.cookie || "");
    const session = verifySessionCookie(cookies.discord_session, process.env.SESSION_SECRET);

    if (!session || !session.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Usuário não autenticado." })
      };
    }

    const sessionUser = session.user.id;
    const sessionName = session.user.username;

    const body = JSON.parse(event.body || "{}");

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Carrinho vazio." })
      };
    }

    const mpItems = [];
    let total = 0;
    let productNames = [];

    for (const item of body.items) {

      const product = PRODUCTS.find(p => p.id === item.id);

      if (!product) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Produto inválido." })
        };
      }

      const quantity = parseInt(item.quantity);

      if (!quantity || quantity <= 0 || quantity > 10) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Quantidade inválida." })
        };
      }

      total += product.price * quantity;
      productNames.push(`${product.title} (x${quantity})`);

      mpItems.push({
        title: product.title,
        quantity: quantity,
        unit_price: product.price,
        currency_id: "BRL"
      });
    }

    const preference = {
    items: mpItems,
  auto_return: "approved",

  back_urls: {
    success: "https://malibu3.netlify.app/#success",
    failure: "https://malibu3.netlify.app/#checkout",
    pending: "https://malibu3.netlify.app/#checkout"
  },

  metadata: {
    discord_id: sessionUser,
    discord_name: sessionName
  },

  notification_url: "https://malibu3.netlify.app/.netlify/functions/mp_webhook"
};

    const response = await mercadopago.preferences.create(preference);

    return {
      statusCode: 200,
      body: JSON.stringify({
        init_point: response.body.init_point
      })
    };

  } catch (err) {
    console.error("Erro MP:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno." })
    };
  }
};
