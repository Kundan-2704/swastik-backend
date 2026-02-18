





const express = require("express");
const Category = require("../model/Category");
const apicache = require("apicache");

const router = express.Router();
const cache = apicache.middleware;

/* ================= GET ROUTES (ALREADY OK) ================= */


/* ================= GET ALL CATEGORIES (ADMIN / TABLE) ================= */
router.get("/",cache("30 minutes"), async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ level: 1, name: 1 })
      .lean();

    const formatted = categories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      level: cat.level,
      parent: cat.parentCategory?.name || "-",
      active: cat.active ?? true,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/level1",cache("30 minutes"), async (req, res) => {
  const categories = await Category.find({ level: 1 }).sort({ name: 1 });
  res.json(categories);
});

router.get("/level2/:parentId", async (req, res) => {
  const categories = await Category.find({
    level: 2,
    parentCategory: req.params.parentId,
  }).sort({ name: 1 })
  .lean();

  res.json(categories);
});

router.get("/level3/:parentId",cache("30 minutes"), async (req, res) => {
  const categories = await Category.find({
    level: 3,
    parentCategory: req.params.parentId,
  }).sort({ name: 1 })
  .lean();

  res.json(categories);
});

/* ================= 🔥 SEED ROUTE (ADD THIS) ================= */
router.post("/seed", async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories must be an array" });
    }

    const map = {};

    // IMPORTANT: level order
    categories.sort((a, b) => a.level - b.level);

    for (const cat of categories) {
      // skip if parent missing
      if (cat.parentCategoryId && !map[cat.parentCategoryId]) {
        continue;
      }

      const saved = await Category.findOneAndUpdate(
        { categoryId: cat.categoryId }, // 🔑 unique key
        {
          name: cat.name,
          level: cat.level,
          parentCategory: cat.parentCategoryId
            ? map[cat.parentCategoryId]
            : null,
        },
        {
          upsert: true,   // ⭐ MAGIC LINE
          new: true,
        }
      );

      map[cat.categoryId] = saved._id;
    }

    apicache.clear();

    return res.status(201).json({
      message: "✅ Categories seeded (duplicate-safe)",
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;
