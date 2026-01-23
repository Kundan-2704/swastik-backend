module.exports = {
  async createPayout({ amount, bankAccountId }) {
    await new Promise(r => setTimeout(r, 300));
    return {
      id: "mock_payout_" + Date.now(),
      status: "processed",
      amount,
      bankAccountId,
    };
  }
};
