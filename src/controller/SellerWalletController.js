const SellerWallet = require("../model/SellerWallet");

class SellerWalletController {
  async getWalletSummary(req, res) {
    try {
      const wallet = await SellerWallet.findOne({ seller: req.seller._id });

      if (!wallet) {
        return res.json({
          availableBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
        });
      }

      return res.json({
        availableBalance: wallet.availableBalance,
        pendingBalance: wallet.pendingBalance,
        totalEarned: wallet.totalEarned,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new SellerWalletController();
