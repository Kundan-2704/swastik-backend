



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







require("dotenv").config(); // ✅ MUST be first line

const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const http = require("http");
const { Server: SocketIOServer } = require("socket.io");


const app = express();

/* ================= MIDDLEWARES ================= */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(cookieParser());

/* =================================================
   ✅ GLOBAL BODY PARSER (SAFE)
================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= TEST ROUTE ================= */

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

const homeCategoryRoutes = require("./routers/HomeCategoryRoutes.js");
const dealRoutes = require("./routers/DealRoutes.js");
const couponRoutes = require("./routers/CouponRoutes");
const SocketService = require("./service/SocketService.js");

const policyRoutes = require("./routers/policyRoutes.js");

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
app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/sellers/report", sellerReportRoutes);

app.use("/admin", adminRoutes);
app.use("/admin/deals", dealRoutes);

app.use("/home", homeCategoryRoutes);
app.use("/api/coupons", couponRoutes);

app.use("/api", policyRoutes);


/* ================= SERVER ================= */

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173"
    ],
    credentials: true,
  },
});

global.io = io;
SocketService.init(io);

server.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
  await connectDB();
});
