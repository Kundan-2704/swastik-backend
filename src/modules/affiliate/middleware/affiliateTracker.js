// const affiliateService = require("../services/AffiliateService");

// module.exports = async (req, res, next) => {
//   const { ref } = req.query;

//   if (ref) {
//     res.cookie("affiliate_ref", ref, {
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       secure: true,
//     });

//     await affiliateService.trackClick(ref, req);
//   }

//   next();
// };



const affiliateService = require("../services/AffiliateService");

module.exports = async (req, res, next) => {
  try {
    const { ref } = req.query;

    // Only if referral exists AND no existing cookie
    if (ref && !req.cookies.affiliate_ref) {

      res.cookie("affiliate_ref", ref, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      await affiliateService.trackClick(ref, req);
    }

    next();
  } catch (error) {
    console.error("Affiliate tracker error:", error);
    next();
  }
};