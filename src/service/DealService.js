// 




const Deal = require("../model/Deal");
const HomeCategory = require("../model/HomeCategory");

class DealService {

    /* ================= ADMIN ================= */

    async getDeals() {
        return await Deal.find()
            .populate("category")
            .populate("products") // ✅ IMPORTANT
            .lean();
    }

    async createDeal(deal) {
        try {
            let category = null;

            if (deal.category?._id) {
                category = await HomeCategory.findById(deal.category._id);
            }

            const newDeal = new Deal({
                ...deal,
                category,
            });

            const savedDeal = await newDeal.save();

            return await Deal.findById(savedDeal._id)
                .populate("category")
                .populate("products"); // ✅ IMPORTANT
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDeal(deal, id) {
        const existingDeal = await Deal.findById(id);

        if (!existingDeal) {
            throw new Error("Deal not found");
        }

        return await Deal.findByIdAndUpdate(
            id,
            { ...deal },
            { new: true }
        )
            .populate("category")
            .populate("products") // ✅ IMPORTANT
            .lean();
    }

    async deleteDeal(id) {
        const deal = await Deal.findById(id);
        if (!deal) {
            throw new Error("Deal not found");
        }
        await Deal.deleteOne({ _id: id });
    }

    /* ================= CUSTOMER ================= */
    // ✅ THIS WAS MISSING (MOST IMPORTANT)
    async getActiveDeals() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await Deal.find({
            startDate: { $lte: today },
            endDate: { $gte: today },
            active: true, // agar field hai
        })
            .populate("products") // 🔥 VERY IMPORTANT
            .populate("category")
            .lean();
    }



}

module.exports = new DealService();
