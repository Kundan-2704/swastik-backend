const Address = require("../model/Address.js");

class AddressController {
  // ✅ SAVE ADDRESS
  async create(req, res) {
    try {
      const address = new Address({
        ...req.body,
        user: req.user._id, // 👈 logged-in user
      });

      const savedAddress = await address.save();
      res.status(201).json(savedAddress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ GET USER ADDRESSES
  async getUserAddresses(req, res) {
    try {
      const addresses = await Address.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AddressController();
