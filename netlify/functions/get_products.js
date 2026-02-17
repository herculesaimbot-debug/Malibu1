exports.handler = async () => {
  const products = [

    // VIPs
    { id:"vip_bronze", category:"VIPs", name:"VIP Bronze (30 dias)", price:23.99, tag:"VIP", desc:"Após a compra, abra um ticket.", img:"/assets/products/bronze.webp" },
    { id:"vip_prata", category:"VIPs", name:"VIP Prata (30 dias)", price:28.99, tag:"VIP", desc:"Após a compra, abra um ticket.", img:"/assets/products/prata.webp" },
    { id:"vip_ouro", category:"VIPs", name:"VIP Ouro (30 dias)", price:33.99, tag:"VIP", desc:"Após a compra, abra um ticket.", img:"/assets/products/ouro.webp" },
    { id:"vip_platina", category:"VIPs", name:"VIP Platina (30 dias)", price:38.99, tag:"VIP", desc:"Após a compra, abra um ticket.", img:"/assets/products/platina.webp" },
    { id:"vip_diamante", category:"VIPs", name:"VIP Diamante (30 dias)", price:00.10, tag:"VIP", desc:"Após a compra, abra um ticket.", img:"/assets/products/diamante.webp" },
    

    // Dinheiro
    { id:"coins_1m", category:"Dinheiro", name:"1.000.000", price:20.00, tag:"Money", desc:"Torne-se um milionário.", img:"/assets/products/1kk.webp" },
    { id:"coins_2m", category:"Dinheiro", name:"2.000.000", price:35.00, tag:"Money", desc:"Torne-se um milionário.", img:"/assets/products/2kk.webp" },
    { id:"coins_3m", category:"Dinheiro", name:"3.000.000", price:50.00, tag:"Money", desc:"Torne-se um milionário.", img:"/assets/products/3kk.webp" },
    { id:"coins_10m", category:"Dinheiro", name:"10.000.000", price:75.00, tag:"Money", desc:"Torne-se um multi-milionário.", img:"/assets/products/10kk.webp" },

    // Levels
    { id:"level_50", category:"Leveis", name:"Level 50", price:30.00, tag:"Level", desc:"Após a compra, abra um ticket.", img:"/assets/products/50.webp" },
    { id:"level_100", category:"Leveis", name:"Level 100", price:43.00, tag:"Level", desc:"Após a compra, abra um ticket.", img:"/assets/products/100.webp" },
    { id:"level_150", category:"Leveis", name:"Level 150", price:60.00, tag:"Level", desc:"Após a compra, abra um ticket.", img:"/assets/products/150.webp" },
    { id:"level_200", category:"Leveis", name:"Level 200", price:75.00, tag:"Level", desc:"Após a compra, abra um ticket.", img:"/assets/products/200.webp" },

    // Organizações
    { id:"org_police", category:"Organizações", name:"Organização policial", price:35.90, tag:"Org", desc:"Entrega manual.", img:"/assets/products/cop.webp" },
    { id:"org_crime", category:"Organizações", name:"Organização criminosa", price:35.90, tag:"Org", desc:"Entrega manual.", img:"/assets/products/fac.webp" },
    { id:"org_medic", category:"Organizações", name:"Organização médico", price:35.90, tag:"Org", desc:"Entrega manual.", img:"/assets/products/med.webp" },
    { id:"org_mechanic", category:"Organizações", name:"Organização mecânico", price:45.90, tag:"Org", desc:"Entrega manual.", img:"/assets/products/mec.webp" },

    // Unban
    { id:"unban_serial", category:"Unban", name:"Desban Serial", price:100.00, tag:"Serviço", desc:"1 UN.", img:"/assets/products/serial.webp" },
    { id:"unban_account", category:"Unban", name:"Desban Conta", price:50.00, tag:"Serviço", desc:"1 UN.", img:"/assets/products/conta.webp" },
    { id:"unban_discord", category:"Unban", name:"Desban Discord", price:14.99, tag:"Serviço", desc:"1 UN.", img:"/assets/products/discord.webp" }

  ];

  return {
    statusCode: 200,
    body: JSON.stringify(products)
  };
};
