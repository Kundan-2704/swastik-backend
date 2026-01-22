// const UserService = require("../service/UserService");
// const SellerService = require("../service/SellerService");
// const jwtProvider = require("../util/jwtProvider");

// const authMiddleware = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "Invalid token" });
//         }

//         const token = authHeader.split(" ")[1];

//         // 🔹 OLD SYSTEM (UNCHANGED)
//         const email = jwtProvider.getEmailFromjwt(token);

//         // 🔹 TRY USER (CUSTOMER / ADMIN)
//         let user = await UserService.findUserByEmail(email);

//         // 🔹 FALLBACK SELLER
//         if (!user) {
//             user = await SellerService.findSellerByEmail(email);
//         }

//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }

//         // 🔥 ASSIGN AFTER RESOLVE
//         req.user = user;



//         next();
//     } catch (error) {
//         console.error("Auth middleware error:", error.message);
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = authMiddleware;



const UserService = require("../service/UserService");
const SellerService = require("../service/SellerService");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    if (decoded.role === "SELLER") {
      user = await SellerService.findSellerByEmail(decoded.email);
    } else {
      user = await UserService.findUserByEmail(decoded.email);
    }

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;


// const UserService = require("../service/UserService");
// const SellerService = require("../service/SellerService");
// const jwtProvider = require("../util/jwtProvider");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Token missing" });
//     }

//     const token = authHeader.split(" ")[1];

//     // ✅ Decode token
//     const decoded = jwtProvider.verifyJwt(token);

//     console.log("JWT DECODED 👉", decoded);

//     /* ================= ADMIN BYPASS ================= */
//     if (decoded.role === "ROLE_ADMIN") {
//       req.user = {
//         _id: decoded.id,
//         email: decoded.email,
//         role: decoded.role,
//       };
//       req.role = decoded.role;
//       return next();
//     }

//     /* ================= USER / SELLER ================= */
//     let user = null;

//     if (decoded.email) {
//       user = await UserService.findUserByEmail(decoded.email);
//     }

//     if (!user && decoded.email) {
//       user = await SellerService.findSellerByEmail(decoded.email);
//     }

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     req.role = decoded.role;

//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// module.exports = authMiddleware;
