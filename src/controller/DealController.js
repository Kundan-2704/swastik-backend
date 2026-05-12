const DealService = require("../service/DealService");
// const apicache = require("apicache");
const apicache = require("apicache");
const cache = apicache.middleware;

class DealController {
  async getAllDeals(req, res) {
    try {
      const deals = await DealService.getDeals();
      return res.status(200).json(deals);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createDeals(req, res) {
    try {
      const deal = req.body;
      const createdDeal = await DealService.createDeal(deal);
      apicache.clear();
      return res.status(201).json(createdDeal);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateDeals(req, res) {
    const { id } = req.params;
    const deal = req.body;
    try {
      const updatedDeal = await DealService.updateDeal(deal, id);
      apicache.clear();
      return res.status(200).json(updatedDeal);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async deleteDeals(req, res) {
    const { id } = req.params;
    console.log("Deleting deal with ID:", id); // Debug log
    try {
      await DealService.deleteDeal(id);
      apicache.clear();
      return res.status(202).json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal:", error); // Debug log
      return res.status(404).json({ error: error.message });
    }
  }

  /* =====================================================
     ✅ NEW METHOD (VERY IMPORTANT)
     Customer ke liye active deals
     ===================================================== */
  async getActiveDeals(req, res) {
    try {
      const deals = await DealService.getActiveDeals();
      return res.status(200).json(deals);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DealController();
