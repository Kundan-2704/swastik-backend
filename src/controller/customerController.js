const User = require("../model/User");
const customerService = require("../service/customerService");

class CustomerController {
  /* ================= GET ALL CUSTOMERS ================= */
  async getAllCustomers(req, res) {
     const users = await User.find();
    try {
      const customers = await customerService.getAllCustomers();
      return res.status(200).json(customers);
      
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch customers",
      });
    }
  }

  /* ================= UPDATE CUSTOMER STATUS ================= */
  async updateCustomerStatus(req, res) {
    try {
      const { id, status } = req.params;

      const updatedCustomer =
        await customerService.updateCustomerStatus(id, status);

      return res.status(200).json(updatedCustomer);
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to update customer status",
      });
    }
  }
}

module.exports = new CustomerController();
