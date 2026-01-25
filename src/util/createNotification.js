const notificationService = require("../service/notificationService");
const mapRole = require("./roleMapper");

const createNotification = async ({
  userId,
  role,
  title,
  message,
  type,
  data = {},
}) => {
  const mappedRole = mapRole(role); // 🔥 ALWAYS MAP

  return await notificationService.createNotification({
    userId,
    role: mappedRole, // only admin/seller/customer goes to DB
    title,
    message,
    type,
    data,
  });
};

module.exports = createNotification;
