// const bcrypt = require("bcrypt");
// const User = require("../model/User");

// class DataInitializeService {
//   async initializeAdminUser() {
//     const adminEmail = "primebeast348@gmail.com";
//     const adminPassword = "swastik123";

//     try {
//       const existingAdmin = await User.findOne({
//         email: adminEmail,
//         role: "ROLE_ADMIN",
//       });

//       if (existingAdmin) {
//         console.log("Admin user already exists");
//         return;
//       }

//       const hashedPassword = await bcrypt.hash(adminPassword, 10);

//       const adminUser = new User({
//         fullName: "Swastik Admin",
//         email: adminEmail,
//         password: hashedPassword,
//         role: "ROLE_ADMIN",
//       });

//       await adminUser.save();
//       console.log("✅ Admin user created with email:", adminEmail);
//     } catch (error) {
//       console.error("❌ Error initializing admin user:", error);
//     }
//   }
// }

// module.exports = new DataInitializeService();



const bcrypt = require("bcrypt");
const User = require("../model/User");

class DataInitializeService {
  async initializeAdminUser() {
    const adminEmail = "primebeast348@gmail.com";
    const adminPassword = "swastik123";

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
