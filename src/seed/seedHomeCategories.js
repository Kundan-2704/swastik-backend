const mongoose = require("mongoose");
const HomeCategory = require("../model/HomeCategory");

// ✅ MongoDB connection
mongoose.connect(
  process.env.MONGO_URI
);

// ✅ HOME CATEGORIES DATA (FIXED & VALIDATED)
const homeCategories = [
  // ================= HOME CATEGORIES =================
  {
    name: "Kosa Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667523/cnxopmjikzsxicqhlw0s.png",
    categoryId: "kosa_sarees",
    section: "home_categories",
  },
  {
    name: "Tussar Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667186/reomnumbmyunvgpylbnq.webp",
    categoryId: "tussar_sarees",
    section: "home_categories",
  },
  {
    name: "Handloom Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667186/mxrjz0gdkvkczyhx1t3r.webp",
    categoryId: "handloom_sarees",
    section: "home_categories",
  },
  {
    name: "Wedding Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667068/b0t5h5f7yaujd25jfvmz.jpg",
    categoryId: "wedding_sarees",
    section: "home_categories",
  },
  {
    name: "Daily Wear Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667186/bdfhudmgcu9i9th1iopv.jpg",
    categoryId: "daily_wear_sarees",
    section: "home_categories",
  },
  {
    name: "Printed Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766658406/ql0lmbsp3f1qywftltwu.webp",
    categoryId: "printed_sarees",
    section: "home_categories",
  },

  // ================= GRID =================
  {
    name: "Pure Kosa",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667523/cnxopmjikzsxicqhlw0s.png",
    categoryId: "kosa_sarees",
    section: "grid",
  },
  {
    name: "Tussar Silk",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667186/reomnumbmyunvgpylbnq.webp",
    categoryId: "tussar_sarees",
    section: "grid",
  },
  {
    name: "Handloom",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667186/mxrjz0gdkvkczyhx1t3r.webp",
    categoryId: "handloom_sarees",
    section: "grid",
  },
  {
    name: "Wedding Collection",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667067/zmdjqongg88ozpkzq1do.webp",
    categoryId: "wedding_sarees",
    section: "grid",
  },
  {
    name: "Daily Wear",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667068/b0t5h5f7yaujd25jfvmz.jpg",
    categoryId: "daily_wear_sarees",
    section: "grid",
  },
  {
    name: "Printed Styles",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667067/wocff53vobsqoxcwghfk.webp",
    categoryId: "printed_sarees",
    section: "grid",
  },

  // ================= SHOP BY CATEGORIES =================
  {
    name: "Pure Kosa Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766595355/bq4b5rcc4lq5lmnqob9v.avif",
    categoryId: "kosa_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Soft Kosa Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766592809/vyvluqvoryam68gjxcv8.webp",
    categoryId: "kosa_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Classic Tussar",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766592809/mcr1swxmqv30wwimcavc.webp",
    categoryId: "tussar_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Silk Tussar",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766570377/mikfgksikvrjnamqrvzs.webp",
    categoryId: "tussar_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Traditional Handloom",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766570379/dbkntuwn491yh3ckvkim.png",
    categoryId: "handloom_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Ethnic Handloom",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766570377/zlkcpkhuha0c7ztykllz.webp",
    categoryId: "handloom_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Bridal Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766570377/em0d4hek0wu10smfvf0y.webp",
    categoryId: "wedding_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Festive Wedding Wear",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766569825/ixydlvf3rvp1irtinh6n.webp",
    categoryId: "wedding_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Casual Daily Wear",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766569825/ydeuhrhr2jjx36ulxrws.webp",
    categoryId: "daily_wear_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Office Wear Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766557003/zdxpnzwkbpi6ancczv9r.jpg",
    categoryId: "daily_wear_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Printed Cotton Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766066777/bmes8hxpspmreljjdo9n.webp",
    categoryId: "printed_sarees",
    section: "shop_by_categories",
  },
  {
    name: "Designer Printed Sarees",
    image: "https://res.cloudinary.com/dey2bny4v/image/upload/v1766667523/cnxopmjikzsxicqhlw0s.png",
    categoryId: "printed_sarees",
    section: "shop_by_categories",
  },
];

// ✅ SEED FUNCTION
async function seed() {
  try {
    await HomeCategory.deleteMany();
    await HomeCategory.insertMany(homeCategories);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
