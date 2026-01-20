const mongoose = require("mongoose");

class CouponModel {
    static getSchema() {
        return new mongoose.Schema(
            {
                code: {
                    type: String,
                    required: true,
                    unique: true,
                    uppercase: true,
                    trim: true,
                },
                discountType: {
                    type: String,
                    enum: ["PERCENT", "FLAT"],
                    required: true,
                },
                discountValue: {
                    type: Number,
                    required: true,
                },
                minOrderValue: {
                    type: Number,
                },
                maxDiscount: {
                    type: Number,
                },
                expiryDate: {
                    type: Date,
                    required: true,
                },
                isActive: {
                    type: Boolean,
                    default: true,
                },
            },
            { timestamps: true }
        );
    }
}

module.exports = mongoose.model("Coupon", CouponModel.getSchema());
