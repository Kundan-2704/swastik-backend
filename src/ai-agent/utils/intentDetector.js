// module.exports = function detectIntent(query) {
//   const q = query.toLowerCase();

//   if (
//     q.includes("saree") ||
//     q.includes("show") ||
//     q.includes("under") ||
//     q.includes("buy")
//   ) {
//     return "SEARCH_PRODUCT";
//   }

//   if (q.includes("care") || q.includes("wash")) {
//     return "CARE_INFO";
//   }

//   if (q.includes("kosa") || q.includes("tussar")) {
//     return "FABRIC_INFO";
//   }

//   if (q.includes("delivery") || q.includes("shipping")) {
//     return "DELIVERY_INFO";
//   }

//   return "UNKNOWN";
// };





module.exports = function detectIntent(query) {
  const q = query.toLowerCase();

  // 🧼 CARE (HIGHEST PRIORITY)
  if (
    q.includes("wash") ||
    q.includes("care") ||
    q.includes("dhona") ||
    q.includes("clean")
  ) {
    return "CARE_INFO";
  }

  // 🚚 DELIVERY
  if (
    q.includes("delivery") ||
    q.includes("deliver") ||
    q.includes("kab") ||
    q.includes("aayega")
  ) {
    return "DELIVERY_INFO";
  }

  // 📘 FABRIC INFO
  if (
    q.includes("kya hota hai") ||
    q.includes("difference") ||
    q.includes("fabric")
  ) {
    return "FABRIC_INFO";
  }

  // 🛒 PRODUCT SEARCH (LAST)
  if (
    q.includes("saree") ||
    q.includes("sadi") ||
    q.includes("sari") ||
    q.includes("under") ||
    q.includes("dikhao") ||
    q.includes("show")
  ) {
    return "SEARCH_PRODUCT";
  }

  return "UNKNOWN";
};
