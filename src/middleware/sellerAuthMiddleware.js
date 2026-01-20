const sellerService = require("../service/SellerService");
const jwtProvider = require("../util/jwtProvider");





const sellerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Bearer + space
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    // ✅ Decode JWT
    const email = jwtProvider.getEmailFromjwt(token);

    // ✅ Fetch seller
    const seller = await sellerService.getSellerByEmail(email);

    if (!seller) {
      return res.status(401).json({
        message: "Seller not authorized",
      });
    }

    // ✅ Optional but RECOMMENDED
    if (seller.accountStatus !== "ACTIVE") {
      return res.status(401).json({
        message: "Seller account not active",
      });
    }


    console.log("AUTH HEADER →", req.headers.authorization);
console.log("EMAIL FROM JWT →", email);
console.log("SELLER STATUS →", seller.accountStatus);


    // ✅ Attach seller
    req.seller = seller;
req.user = seller;
    next();
  } catch (error) {
    console.error("SELLER AUTH ERROR →", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = sellerMiddleware;
