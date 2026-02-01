



// const express = require("express");
// const connectDB = require("./db/db");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.send({ message: "Hello Welcome To Swastik Backend System!" });
// });

// /* ================= ROUTES ================= */

// const authRoutes = require("./routers/AuthRoutes.js");
// const adminRoutes = require("./routers/AdminRoutes.js");
// const sellerRoutes = require("./routers/SellerRoutes.js");
// const userRoutes = require("./routers/UserRoutes.js");

// const productRoutes = require("./routers/ProductsRoutes.js");
// const sellerProductRoutes = require("./routers/SellerProductsRoutes.js");
// const categoryRoutes = require("./routers/categoryRoutes.js");

// const cartRoutes = require("./routers/CartRoutes.js");
// const orderRoutes = require("./routers/OrderRoutes.js");
// const sellerOrderRoutes = require("./routers/SellerOrderRoutes.js");

// const addressRoutes = require("./routers/AddressRoutes.js");
// const paymentRoutes = require("./routers/PaymentRoutes.js");
// const transactionRoutes = require("./routers/TransactionRoutes.js");
// const sellerReportRoutes = require("./routers/SellerReportRoutes.js");

// const homeCategoryRoutes = require("./routers/HomeCategoryRoutes.js");
// const dealRoutes = require("./routers/DealRoutes.js");

// const couponRoutes = require("./routers/CouponRoutes");

// /* ================= MOUNTS ================= */

// app.use("/auth", authRoutes);

// app.use("/api/users", userRoutes);
// app.use("/sellers", sellerRoutes);

// app.use("/products", productRoutes);
// app.use("/api/seller/products", sellerProductRoutes);
// app.use("/api/categories", categoryRoutes);

// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/sellers/orders", sellerOrderRoutes);

// app.use("/api/addresses", addressRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/sellers/report", sellerReportRoutes);

// app.use("/admin", adminRoutes);
// app.use("/admin/deals", dealRoutes);


// app.use("/home", homeCategoryRoutes);

// app.use("/api/coupons", couponRoutes);

// /* ================= SERVER ================= */

// const port = 5000;

// app.listen(port, async () => {
//   console.log(`🚀 Server running on port ${port}`);
//   await connectDB();
// });







// require("dotenv").config(); // ✅ MUST be first line

// const express = require("express");
// const connectDB = require("./db/db");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");


// // const http = require("http");
// // const { Server: SocketIOServer } = require("socket.io");


// const app = express();

// /* ================= MIDDLEWARES ================= */

// const allowedRegex = /^https:\/\/swastik-frontend.*\.vercel\.app$/;

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (
//         allowedRegex.test(origin) ||
//         origin === "http://localhost:5173"
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );




// app.use(cookieParser());

// /* =================================================
//    ✅ GLOBAL BODY PARSER (SAFE)
// ================================================== */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* ================= TEST ROUTE ================= */

// app.get("/", (req, res) => {
//   res.send({ message: "Hello Welcome To Swastik Backend System!" });
// });

// /* ================= ROUTES ================= */

// const authRoutes = require("./routers/AuthRoutes.js");
// const adminRoutes = require("./routers/AdminRoutes.js");
// const sellerRoutes = require("./routers/SellerRoutes.js");
// const userRoutes = require("./routers/UserRoutes.js");

// const productRoutes = require("./routers/ProductsRoutes.js");
// const sellerProductRoutes = require("./routers/SellerProductsRoutes.js");
// const categoryRoutes = require("./routers/categoryRoutes.js");

// const cartRoutes = require("./routers/CartRoutes.js");
// const orderRoutes = require("./routers/OrderRoutes.js");
// const sellerOrderRoutes = require("./routers/SellerOrderRoutes.js");

// const addressRoutes = require("./routers/AddressRoutes.js");
// const paymentRoutes = require("./routers/PaymentRoutes.js");
// const webhookRoutes = require("./routers/RazorpayWebhookRoutes.js");
// const transactionRoutes = require("./routers/TransactionRoutes.js");
// const sellerReportRoutes = require("./routers/SellerReportRoutes.js");

// const homeCategoryRoutes = require("./routers/HomeCategoryRoutes.js");
// const dealRoutes = require("./routers/DealRoutes.js");
// const couponRoutes = require("./routers/CouponRoutes");
// // const SocketService = require("./service/SocketService.js");

// const policyRoutes = require("./routers/policyRoutes.js");

// /* ================= MOUNTS ================= */

// app.use("/auth", authRoutes);

// app.use("/api/users", userRoutes);
// app.use("/sellers", sellerRoutes);

// app.use("/products", productRoutes);
// app.use("/api/seller/products", sellerProductRoutes);
// app.use("/api/categories", categoryRoutes);

// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/sellers/orders", sellerOrderRoutes);

// app.use("/api/addresses", addressRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/payment", webhookRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/sellers/report", sellerReportRoutes);

// app.use("/admin", adminRoutes);
// app.use("/admin/deals", dealRoutes);

// app.use("/home", homeCategoryRoutes);
// app.use("/api/coupons", couponRoutes);

// app.use("/api", policyRoutes);


// /* ================= SERVER ================= */

// const port = process.env.PORT || 5000;

// // const server = http.createServer(app);

// // const io = new SocketIOServer(server, {
// //   cors: {
// //     origin: [
// //       process.env.CLIENT_URL,
// //       "http://localhost:5173"
// //     ],
// //     credentials: true,
// //   },
// // });

// // global.io = io;
// // SocketService.init(io);

// app.listen(port, async () => {
//   console.log(`🚀 Server running on port ${port}`);
//   await connectDB();
// });







require("dotenv").config();

const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

/* ================= CORS ================= */

const allowedRegex = /^https:\/\/swastik-frontend.*\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedRegex.test(origin) || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

/* ================= WEBHOOK FIRST (🔥 MUST BE FIRST) ================= */

const webhookRoutes = require("./routers/RazorpayWebhookRoutes");
app.use("/api/payment", webhookRoutes); // ⚠️ raw body untouched

/* ================= BODY PARSER AFTER WEBHOOK ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/invoices", express.static(path.join(process.cwd(), "invoices")));


/* ================= TEST ================= */
app.get("/", (req, res) => {
  res.send({ message: "Hello Welcome To Swastik Backend System!" });
});

/* ================= ROUTES ================= */

const authRoutes = require("./routers/AuthRoutes.js");
const adminRoutes = require("./routers/AdminRoutes.js");
const sellerRoutes = require("./routers/SellerRoutes.js");
const userRoutes = require("./routers/UserRoutes.js");

const productRoutes = require("./routers/ProductsRoutes.js");
const sellerProductRoutes = require("./routers/SellerProductsRoutes.js");
const categoryRoutes = require("./routers/categoryRoutes.js");

const cartRoutes = require("./routers/CartRoutes.js");
const orderRoutes = require("./routers/OrderRoutes.js");
const sellerOrderRoutes = require("./routers/SellerOrderRoutes.js");

const addressRoutes = require("./routers/AddressRoutes.js");
const paymentRoutes = require("./routers/PaymentRoutes.js");
const transactionRoutes = require("./routers/TransactionRoutes.js");
const sellerReportRoutes = require("./routers/SellerReportRoutes.js");

const SellerPayoutRoutes = require("./routers/SellerPayoutRoutes.js");

const AdminPayoutRoutes = require("./routers/AdminPayoutRoutes.js");

const sellerWalletRoutes = require("./routers/SellerWalletRoutes.js");

const adminOrderRoutes = require("./routers/adminOrderRoutes.js");


const adminPaymentRoutes = require("./routers/AdminPaymentRoutes.js");

const homeCategoryRoutes = require("./routers/HomeCategoryRoutes.js");
const dealRoutes = require("./routers/DealRoutes.js");
const couponRoutes = require("./routers/CouponRoutes.js");
const policyRoutes = require("./routers/policyRoutes.js");

const notificationRoutes = require("./routers/NotificationRoutes.js");

const returnRoutes = require("./routers/ReturnRoutes.js");

const packingSlipRoutes = require("./routers/PackingSlipRoutes.js");

const invoiceRoutes = require("./routers/InvoiceRoutes.js");

const ReplacementRoutes = require("./routers/ReplacementRoutes.js");

/* ================= MOUNTS ================= */

app.use("/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/sellers", sellerRoutes);

app.use("/products", productRoutes);
app.use("/api/seller/products", sellerProductRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sellers/orders", sellerOrderRoutes);

app.use("/api/addresses", addressRoutes);
app.use("/api/payment", paymentRoutes); // ⚠️ normal routes AFTER parser
app.use("/api/transactions", transactionRoutes);
app.use("/api/sellers/report", sellerReportRoutes);

app.use("/api/sellers/payouts", SellerPayoutRoutes);
app.use("/api/admin/payouts", AdminPayoutRoutes);

app.use("/api/sellers/wallet", sellerWalletRoutes);

app.use("/admin", adminRoutes);
app.use("/admin/deals", dealRoutes);

app.use("/api/admin/payments", adminPaymentRoutes);

app.use("/admin", adminOrderRoutes);


app.use("/home", homeCategoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api", policyRoutes);

app.use("/notifications", notificationRoutes);

app.use("/api/returns", returnRoutes);

app.use("/api", packingSlipRoutes);

app.use("/api", invoiceRoutes);


app.use("/api/replacements", ReplacementRoutes);

/* ================= SERVER ================= */

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
  await connectDB();
});
