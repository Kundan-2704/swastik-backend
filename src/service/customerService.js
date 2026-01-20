const User = require("../model/User");

class CustomerService {
  /* ================= GET ALL CUSTOMERS ================= */
  async getAllCustomers() {
    try {
      const customers = await User.find({
        role: "ROLE_CUSTOMER", // ✅ FIXED
      })
        .select("-password")
        .sort({ createdAt: -1 });

      return customers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /* ================= UPDATE CUSTOMER STATUS ================= */
  async updateCustomerStatus(customerId, status) {
    try {
      if (!["ACTIVE", "BLOCKED"].includes(status)) {
        throw new Error("Invalid status value");
      }

      const customer = await User.findByIdAndUpdate(
        customerId,
        { status },
        { new: true }
      ).select("-password");

      if (!customer) {
        throw new Error("Customer not found");
      }

      return customer;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CustomerService();
