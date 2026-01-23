// const PayoutService = require("../service/PayoutService");

// class AdminPayoutController {

//   async getAllPayouts(req, res) {
//     try {
//       const page = Number(req.query.page) || 1;
//       const limit = Number(req.query.limit) || 50;

//       const payouts = await PayoutService.getAllPayouts(page, limit);
//       return res.status(200).json(payouts);

//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   }

//   async updatePayoutStatus(req, res) {
//     try {
//       const { payoutId } = req.params;
//       const { status, remark } = req.body;

//       const payout = await PayoutService.updateStatus(payoutId, {
//         status,
//         remark,
//         processedBy: req.admin._id,
//         processedAt: new Date(),
//       });

//       if (!payout) {
//         return res.status(404).json({ message: "Payout not found" });
//       }

//       return res.status(200).json(payout);

//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   }
// }

// module.exports = new AdminPayoutController();





const PayoutService = require("../service/PayoutService");

class AdminPayoutController {

  async getAllPayouts(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const payouts = await PayoutService.getAllPayouts(page, limit);
      return res.status(200).json(payouts);

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }


  async updatePayoutStatus(req, res) {
    try {
      const { payoutId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status required" });
      }

      // 🔥 IMPORTANT FIX (no adminAuth change)
      const adminId =
        req.admin?._id ||
        req.user?._id ||
        null;

      const payout = await PayoutService.updateStatus(
        payoutId,
        status,
        adminId
      );

      return res.status(200).json(payout);

    } catch (error) {
      console.error("ADMIN PAYOUT ERROR →", error.message);
      return res.status(400).json({ error: error.message });
    }
  }

}

module.exports = new AdminPayoutController();
