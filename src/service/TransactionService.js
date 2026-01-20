const Order = require("../model/Order");
const Seller = require("../model/Seller");
const Transaction = require("../model/Transaction");


class TransactionService {
    async createTransaction(orderId) {
        const order = await Order.findOne(orderId).populate('seller');
        if (!order) {
            throw new Error("Order not found");
        }

        const seller = await Seller.findById(order.seller._id);
        if (!order) {
            throw new Error("Seller not found");
        }

        const transaction = new Transaction({
            seller: seller._id,
            customer: order.user,
            order: order._id
        });

        return await transaction.save();

    }

    async getTransactionsBySellerId(sellerId) {
        return await Transaction.find({ seller: sellerId }).populate("order");
    }

    async getAllTransactions(sellerId) {
        return await Transaction.find({ seller: sellerId }).populate("seller order customer");
    }

}

module.exports = new TransactionService();