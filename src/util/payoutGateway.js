let gateway = null;

const getPayoutGateway = () => {
  if (gateway) return gateway;

  if (process.env.PAYOUT_MODE === "MOCK") {
    gateway = require("./razorpayXMock");
  } else {
    const real = require("./razorpayX");
    real.initRazorpay();
    gateway = real;
  }

  return gateway;
};

module.exports = { getPayoutGateway };
