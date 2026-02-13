const detectIntent = require("../utils/intentDetector");
const replies = require("../constants/agentReplies");
const Product = require("../../model/Product");

const getReply = require("../utils/getReply");


class AIAgentService {
  // async handleQuery(query) {
  //   const intent = detectIntent(query);

  //   switch (intent) {
  //     case "SEARCH_PRODUCT":
  //       return await this.searchProducts(query);

  //     case "FABRIC_INFO":
  //       return { reply: replies.fabric };

  //     case "CARE_INFO":
  //       return { reply: replies.care };

  //     case "DELIVERY_INFO":
  //       return { reply: replies.delivery };

  //     default:
  //       return { reply: replies.fallback };
  //   }
  // }


  async handleQuery(query) {
  const intent = detectIntent(query);

  switch (intent) {
    case "SEARCH_PRODUCT":
      return await this.searchProducts(query);

    case "FABRIC_INFO":
      return { reply: getReply("fabric") };

    case "CARE_INFO":
      return { reply: getReply("care") };

    case "DELIVERY_INFO":
      return { reply: getReply("delivery") };

    case "AVAILABILITY_INFO":
      return { reply: getReply("availability") };

    case "PRICE_INFO":
      return { reply: getReply("priceInfo") };

    case "SUGGESTION":
      return { reply: getReply("suggestion") };

    default:
      return { reply: getReply("fallback") };
  }
}


  async searchProducts(query) {
  const q = query.toLowerCase();
  const filters = {
    inStock: true
  };

  // 🧵 FABRIC / KEYWORD (title + craftStory)
  if (q.includes("kosa")) {
    filters.$or = [
      { title: /kosa/i },
      { craftStory: /kosa/i }
    ];
  }

  if (q.includes("tussar")) {
    filters.$or = [
      { title: /tussar/i },
      { craftStory: /tussar/i }
    ];
  }

  // 💰 PRICE (sellingPrice)
  let maxPrice;

  const numberMatch = q.match(/\d+/);
  if (numberMatch) {
    maxPrice = Number(numberMatch[0]);
  }

  if (q.includes("hazaar") && numberMatch) {
    maxPrice = Number(numberMatch[0]) * 1000;
  }

  if (maxPrice) {
    filters.sellingPrice = { $lte: maxPrice };
  }

  // 🛒 SAREE KEYWORD
  if (q.includes("saree") || q.includes("sadi") || q.includes("sari")) {
    filters.title = /saree|sadi|sari/i;
  }

  const products = await Product.find(filters)
    .select("title sellingPrice images colors")
    .limit(6)
    .lean();

  if (!products.length) {
    return {
      reply: "Is budget me koi handloom saree available nahi hai."
    };
  }

  return {
    reply: `${products.length} handloom sarees aapke liye available hain.`,
    products
  };
}

  
}

module.exports = new AIAgentService();
