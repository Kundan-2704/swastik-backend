const ReturnRequest = require("../model/ReturnRequest");
const STATUS = require("../enums/ReturnStatus");

class ReturnService {
  async create(data) {
    const ret = await ReturnRequest.create(data);
    return { success: true, data: ret };
  }

  async list(query) {
    const returns = await ReturnRequest.find(query)
      .populate("orderId productId customerId sellerId")
      .sort({ createdAt: -1 });

    return { success: true, data: returns };
  }

  async getById(id) {
    const ret = await ReturnRequest.findById(id)
      .populate("orderId productId customerId sellerId");

    if (!ret) throw new Error("Return request not found");
    return { success: true, data: ret };
  }

  async sellerApprove(id, sellerNote) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      {
        status: STATUS.APPROVED,
        sellerNote
      },
      { new: true }
    );
  }

  async sellerReject(id, sellerNote) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      {
        status: STATUS.REJECTED,
        sellerNote
      },
      { new: true }
    );
  }

  async markPickedUp(id) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      { status: STATUS.PICKED_UP },
      { new: true }
    );
  }

  async markReceived(id) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      { status: STATUS.RECEIVED },
      { new: true }
    );
  }

  async refund(id, amount) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      {
        status: STATUS.REFUNDED,
        refundAmount: amount
      },
      { new: true }
    );
  }

  async replace(id) {
    return await ReturnRequest.findByIdAndUpdate(
      id,
      { status: STATUS.REPLACED },
      { new: true }
    );
  }
}

module.exports = new ReturnService();
