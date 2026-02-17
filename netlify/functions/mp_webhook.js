const mercadopago = require("mercadopago");
const fetch = require("node-fetch");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

exports.handler = async (event) => {
  try {

    const body = JSON.parse(event.body || "{}");

    if (body.type !== "payment") {
      return { statusCode: 200 };
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return { statusCode: 400 };
    }

    const payment = await mercadopago.payment.findById(paymentId);
    const data = payment.body;

    if (data.status !== "approved") {
      return { statusCode: 200 };
    }

    const discordId = data.metadata?.discord_id || "Não identificado";
    const discordName = data.metadata?.discord_name || "Desconhecido";
    const total = data.transaction_amount;
    const date = new Date(data.date_approved).toLocaleString("pt-BR");

    const productNames = data.additional_info?.items
      ?.map(i => `${i.title} (x${i.quantity})`)
      .join("\n") || "Não identificado";

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "💰 Compra Aprovada",
          color: 3066993,
          fields: [
            { name: "👤 Usuário", value: `${discordName} (${discordId})` },
            { name: "🛒 Produto(s)", value: productNames },
            { name: "📅 Data", value: date }
            { name: "💵 Valor", value: `R$ ${total}` },
          ]
        }]
      })
    });

    return { statusCode: 200 };

  } catch (err) {
    console.error("Erro webhook:", err);
    return { statusCode: 500 };
  }
};
