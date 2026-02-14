const mongoose = require("mongoose"); // ✅ MUST

const Category = require("../model/Category.js");
const Product = require("../model/Product.js");
const calculatedDiscountPercentage = require("../util/calculateDiscountPercenteg");


class ProductService {


 

async getAllProducts(query) {
  try {
    const {
      categoryId,
      search,
      pageNumber = 1,
      sort = "newest",
      color,
      size,
      minPrice,
      maxPrice,
      minDiscount,
    } = query;

    const filterQuery = {};

    /* ================= SEARCH ================= */
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { fabric: { $regex: search, $options: "i" } },
      ];
    }

    /* ================= CATEGORY FILTER ================= */
    if (categoryId) {
      const selectedCategory = await Category.findOne({ categoryId });

      // ❌ invalid category
      if (!selectedCategory) {
        return {
          content: [],
          totalPages: 0,
          totalElement: 0,
        };
      }

      let categoryIds = [];

      // level 3 (leaf)
      if (selectedCategory.level === 3) {
        categoryIds = [selectedCategory._id];
      }

      // level 2
      else if (selectedCategory.level === 2) {
        const level3 = await Category.find({
          parentCategory: selectedCategory._id,
        });

        categoryIds =
          level3.length > 0
            ? level3.map((c) => c._id)
            : [selectedCategory._id];
      }

      // level 1 (🔥 FIXED BUG)
      else if (selectedCategory.level === 1) {
        const level2 = await Category.find({
          parentCategory: selectedCategory._id,
        });

        if (level2.length === 0) {
          // 🔥 VERY IMPORTANT FIX
          categoryIds = [selectedCategory._id];
        } else {
          const level2Ids = level2.map((c) => c._id);

          const level3 = await Category.find({
            parentCategory: { $in: level2Ids },
          });

          categoryIds =
            level3.length > 0
              ? level3.map((c) => c._id)
              : level2Ids;
        }
      }

      // 🔒 safety net
      if (categoryIds.length === 0) {
        return {
          content: [],
          totalPages: 0,
          totalElement: 0,
        };
      }

      filterQuery.category = { $in: categoryIds };
    }

    /* ================= OTHER FILTERS ================= */
    if (color) filterQuery["colors.name"] = color;
    if (size) filterQuery.sizes = size;

    if (minPrice && maxPrice) {
      filterQuery.sellingPrice = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    if (minDiscount) {
      filterQuery.discountPercent = {
        $gte: Number(minDiscount),
      };
    }

    /* ================= SORT ================= */
    let sortQuery = {};
    if (sort === "price_low") {
      sortQuery = { sellingPrice: 1 };
    } else if (sort === "price_high") {
      sortQuery = { sellingPrice: -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    /* ================= PAGINATION ================= */
    const limit = 12;
    const page = Math.max(Number(pageNumber), 1);
    const skip = (page - 1) * limit;

    const products = await Product.find(filterQuery)
      .populate("seller", "businessDetails")
      .populate("category", "name categoryId level")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalElement = await Product.countDocuments(filterQuery);
    const totalPages = Math.max(1, Math.ceil(totalElement / limit));

    return {
      content: products,
      totalPages,
      totalElement,
    };
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR →", error.message);
    throw error;
  }
}



  async createProduct(data, seller) {
    try {
      if (!seller || !seller._id) {
        throw new Error("Seller missing");
      }

      const discountPercent = calculatedDiscountPercentage(
        data.mrpPrice,
        data.sellingPrice
      );

      // ===== CATEGORY VALIDATION (UNCHANGED) =====
      const level1 = await Category.findOne({
        categoryId: data.category,
        level: 1,
      });
      if (!level1) throw new Error("Invalid level 1 category");

      const level2 = await Category.findOne({
        categoryId: data.category2,
        level: 2,
        parentCategory: level1._id,
      });
      if (!level2) throw new Error("Invalid level 2 category");

      const level3 = await Category.findOne({
        categoryId: data.category3,
        level: 3,
        parentCategory: level2._id,
      });
      if (!level3) throw new Error("Invalid level 3 category");

      // ===== PRODUCT CREATE (FIXED) =====
      const product = new Product({
        title: data.title,
        description: data.description,
        images: data.images,

        mrpPrice: data.mrpPrice,
        sellingPrice: data.sellingPrice,
        discountPercent,

        quantity: data.quantity,
        inStock: data.quantity > 0,

        // ✅ FIX HERE
        colors: data.colors || [],
        sizes: data.sizes || [],

        details: data.details || {},
        delivery: data.delivery || {},
        craftStory: data.craftStory || "",
        faqs: data.faqs || [],

        seller: seller._id,
        category: level3._id,
      });

      return await product.save();

    } catch (error) {
      console.error("PRODUCT SERVICE ERROR →", error.message);
      throw error;
    }
  }



  async getProductBySeller(sellerId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    return await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }


  async findProductById(productId) {
    try {
      const product = await Product.findById(productId)
        .populate("seller", "businessDetails")
        .populate("category", "name categoryId");

      if (!product) {
        return null;
      }

      return product;

    } catch (error) {
      console.error("FIND PRODUCT BY ID ERROR →", error.message);
      throw error;
    }
  }



  async updateProduct(productId, data) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      // 🔥 PARTIAL UPDATE (inline stock edit safe)
      Object.keys(data).forEach((key) => {
        product[key] = data[key];
      });

      // 🧠 Auto stock sync
      if (data.quantity !== undefined) {
        product.inStock = data.quantity > 0;
      }

      await product.save(); // validators run here
      return product;

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR →", error.message);
      throw error;
    }
  }


  async bulkUpdateStock(productIds, quantity) {
    await Product.updateMany(
      { _id: { $in: productIds } },
      {
        $set: {
          quantity,
          inStock: quantity > 0,
        },
      }
    );

    return Product.find({ _id: { $in: productIds } });
  }




  async deleteProduct(productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product id");
      }

      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      await Product.findByIdAndDelete(productId);

      return productId;
    } catch (error) {
      console.error("DELETE PRODUCT ERROR →", error.message);
      throw error;
    }
  }



}




module.exports = new ProductService();
