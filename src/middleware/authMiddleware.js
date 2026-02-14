


// const UserService = require("../service/UserService");
// const SellerService = require("../service/SellerService");
// const jwt = require("jsonwebtoken");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token" });
//     }

//     const token = authHeader.split(" ")[1];
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // let user = null;

//     // if (decoded.role === "SELLER") {
//     //   user = await SellerService.findSellerByEmail(decoded.email);
//     // } else {
//     //   user = await UserService.findUserByEmail(decoded.email);
//     // }

//     // if (!user) return res.status(401).json({ message: "User not found" });

//     // req.user = user;

// const decoded = jwt.verify(token, process.env.JWT_SECRET);

// let user = null;

// if (decoded.role === "ROLE_SELLER") {
//    user = await SellerService.findSellerByEmail(decoded.email);
// } else {
//    user = await UserService.findUserByEmail(decoded.email);
// }

// if (!user) return res.status(401).json({ message: "User not found" });

// req.user = {
//    ...user._doc,
//    id: decoded.id,
//    role: decoded.role,
//    sellerId: decoded.sellerId || null 
// };

// next();

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;





const UserService = require("../service/UserService");
const SellerService = require("../service/SellerService");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (!res.headersSent)
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (decoded.role && decoded.role.includes("SELLER")) {

      user = await SellerService.getSellerByEmail(decoded.email); 

      if (!user) {
        if (!res.headersSent)
          return res.status(401).json({ message: "Seller not found" });
      }

      req.user = {
        ...user._doc,
        id: user._id,
        role: decoded.role,
        sellerId: user._id 
      };

    } else {

      user = await UserService.findUserByEmail(decoded.email);

      if (!user) {
        if (!res.headersSent)
          return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        ...user._doc,
        id: user._id,
        role: decoded.role
      };
    }

    return next(); 

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    if (!res.headersSent) 
      return res.status(401).json({
        message: "Invalid token",
      });
  }
};

module.exports = authMiddleware;