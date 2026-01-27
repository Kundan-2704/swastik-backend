class CourierInterface {
  async createShipment(order) {}
  async trackShipment(order) {}
  async cancelShipment(order) {}
  async generateLabel(order) {} // admin only
}

module.exports = CourierInterface;
