// const PayoutService = require("../service/PayoutService");

// class SellerPayoutController {

//   async requestPayout(req, res) {
//     try {
//       const seller = req.seller;
//       const { amount, method, bankDetails, upiId } = req.body;

//       if (!amount || amount <= 0) {
//         return res.status(400).json({ message: "Invalid amount" });
//       }

//       const payout = await PayoutService.createPayout({
//         seller: seller._id,
//         amount,
//         method,
//         bankDetails: method === "bank" ? bankDetails : undefined,
//         upiId: method === "upi" ? upiId : undefined,
//       });

//       return res.status(201).json(payout);

//     } catch (error) {
//       console.error("SELLER PAYOUT ERROR →", error.message);
//       return res.status(400).json({ error: error.message });
//     }
//   }

//   async getMyPayouts(req, res) {
//     try {
//       const seller = req.seller;
//       const page = Number(req.query.page) || 1;
//       const limit = Number(req.query.limit) || 20;

//       const payouts = await PayoutService.getSellerPayouts(
//         seller._id,
//         page,
//         limit
//       );

//       return res.status(200).json(payouts);

//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   }
// }

// module.exports = new SellerPayoutController();







const PayoutService = require("../service/PayoutService");

class SellerPayoutController {

  async requestPayout(req, res) {
    try {
      const seller = req.seller;
      const { amount, method, bankDetails, upiId } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const payout = await PayoutService.createPayout({
        seller: seller._id,
        amount,
        method,
        bankDetails: method === "bank" ? bankDetails : undefined,
        upiId: method === "upi" ? upiId : undefined,
      });

      return res.status(201).json(payout);

    } catch (error) {
      console.error("SELLER PAYOUT ERROR →", error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async getMyPayouts(req, res) {
    try {
      const seller = req.seller;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const payouts = await PayoutService.getSellerPayouts(
        seller._id,
        page,
        limit
      );

      return res.status(200).json(payouts);

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SellerPayoutController();
