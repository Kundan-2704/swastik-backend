const UserRoles = require("../domain/userRole");

const roleMapper = (role) => {
  if (!role) return "customer";

  // already normalized
  if (["admin", "seller", "customer"].includes(role)) {
    return role;
  }

  switch (role) {
    case UserRoles.ADMIN:
      return "admin";
    case UserRoles.SELLER:
      return "seller";
    case UserRoles.CUSTOMER:
      return "customer";
    default:
      return "customer";
  }
};

module.exports = roleMapper;
