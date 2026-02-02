const CartService = require("../service/CartService");
const OrderService = require("../service/OrderService");
const Order = require("../model/Order");
const Address = require("../model/Address");
// const Notification = require("../model/Notification");

const createNotification = require("../util/createNotification");
const UserRoles = require("../domain/userRole");
const { SUCCESS } = require("../domain/PaymentStatus");

const path = require("path");
const fs = require("fs");

class OrderController {

  // =================================================
  // ✅ CREATE ORDER
  // =================================================
  async createOrder(req, res) {
    try {
      const user = req.user;
      const { addressId, paymentGateway } = req.body;

      // ===============================
      // 1️⃣ VALIDATE ADDRESS ID
      // ===============================
      if (!addressId) {
        return res.status(400).json({
          message: "Address is required",
        });
      }

      // ===============================
      // 2️⃣ FETCH ADDRESS (REAL DATA)
      // ===============================
      const address = await Address.findOne({
        _id: addressId,
        user: user._id,
      });

      if (!address) {
        return res.status(404).json({
          message: "Address not found",
        });
      }

      // ===============================
      // 3️⃣ FETCH USER CART
      // ===============================
      const cart = await CartService.findUserCart(user._id);

      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      // ===============================
      // 4️⃣ ADDRESS SNAPSHOT
      // ===============================
      const shippingAddress = {
        name: address.name,
        mobile: address.mobile,
        address: address.address,
        locality: address.locality,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode, // ⚠️ spelling matches Address model
      };

      // ===============================
      // 5️⃣ CREATE ORDER
      // ===============================
      const orders = await OrderService.createorder(
        user,
        shippingAddress,
        cart,
        paymentGateway || "COD"
      );



const sellerIds = new Set(
  cart.cartItems.map((i) => i.product.seller.toString())
);

for (const sellerId of sellerIds) {
  await createNotification({
    userId: sellerId,
    role: UserRoles.SELLER,
    title: "New Order Received 🛒",
    message: `Order #${orders._id} placed`,
    type: "ORDER",
    data: { orderId: orders._id },
  });
}





      return res.status(201).json({
        message: "Order created successfully",
        SUCCESS:true,
        orders,
      });

    } catch (error) {
      console.error("❌ ORDER ERROR 👉", error);
      return res.status(500).json({
        message: "Order creation failed",
        error: error.message,
      });
    }
  }

 

// =================================================
// ✅ GET ORDER BY ID (ADMIN / SELLER / CUSTOMER SAFE)
// =================================================
async getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const user = req.user;

    let order;

    // 🔥 ADMIN: can see any order
    if (user.role === "ADMIN" || user.role === "ROLE_ADMIN") {
      order = await OrderService.findOrderById(orderId);
    }
    // 🔥 SELLER: only own order items
    else if (user.role === "SELLER") {
      order = await OrderService.findSellerOrderById(orderId, user._id);
    }
    // 🔥 CUSTOMER: only own orders
    else {
      order = await OrderService.findUserOrderById(orderId, user._id);
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

// =================================================
// ✅ GET ORDER ITEM BY ID (SECURE - OK ALREADY)
// =================================================
async getOrderItemById(req, res) {
  try {
    const { orderItemId } = req.params;
    const userId = req.user._id;

    const orderItem = await OrderService.findOrderItemById(
      orderItemId,
      userId
    );

    return res.status(200).json(orderItem);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}


  // =================================================
  // ✅ USER ORDER HISTORY
  // =================================================
  async getUserOrderHistory(req, res) {
    try {
      const user = req.user;
      const orders = await OrderService.usersOrderHistory(user._id);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("ORDER HISTORY ERROR 👉", error);
      return res.status(400).json({ error: error.message });
    }
  }

  // =================================================
  // ✅ SELLER ORDERS
  // =================================================
  async getSellersOrders(req, res) {
    try {
      const sellerId = req.seller._id;
      const orders = await OrderService.getSellersOrders(sellerId);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // =================================================
  // ✅ UPDATE ORDER STATUS
  // =================================================
  async updateOrderStatus(req, res) {
    try {
      const { orderId, orderStatus } = req.params;
      const updatedOrder =
        await OrderService.updateOrderStatus(orderId, orderStatus);

      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.orderStatus === "DELIVERED") {
        return res.status(400).json({ message: "Delivered order cannot be cancelled" });
      }

      order.orderStatus = "CANCELLED";
      await order.save();

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


//   async downloadInvoice(req, res) {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId);

//     if (!order?.invoice?.pdfUrl) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     return res.download(order.invoice.pdfUrl);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


async downloadInvoice(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order?.invoice?.pdfUrl) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ✅ URL se sirf filename nikalo
    const fileName = path.basename(order.invoice.pdfUrl);

    // ✅ REAL filesystem path banao
    const filePath = path.join(process.cwd(), "invoices", fileName);

    // ✅ safety check
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice file missing on server" });
    }

    return res.download(filePath);
  } catch (err) {
    console.error("DOWNLOAD INVOICE ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
}

}

module.exports = new OrderController();
