import cron from "node-cron";
import Payout from "../model/Payout.js";
import PayoutService from "../service/PayoutService.js";

cron.schedule("0 2 * * *", async () => {
  try {
    const payouts = await Payout.find({ status: "PENDING" });
    for (const p of payouts) {
      await PayoutService.processPayout(p._id);
    }
  } catch (e) {
    console.log("Payout cron error:", e.message);
  }
});
