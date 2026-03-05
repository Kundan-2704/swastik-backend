const Affiliate = require("../models/Affiliate");

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const affiliate = await Affiliate.findOne({
      userId: req.user._id,
      status: "active",
    });

    if (!affiliate) {
      return res.status(403).json({
        message: "Affiliate access only",
      });
    }

    // Optional: attach affiliate data to request
    req.affiliate = affiliate;

    next();
  } catch (error) {
    console.error("affiliateOnly middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};