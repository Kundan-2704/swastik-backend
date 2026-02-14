


const bcrypt = require("bcrypt");
const User = require("../model/User");

class DataInitializeService {
  async initializeAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠️ Admin env missing, skipping init");
      return;
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "ROLE_ADMIN",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      fullName: "Swastik Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ROLE_ADMIN",
    });

    await adminUser.save();
    console.log("✅ Admin created:", adminEmail);
  }
}

module.exports = new DataInitializeService();
