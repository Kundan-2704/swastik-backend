const Product = require("../model/Product");
const ProductService = require("../service/ProductService");
// const apicache = require("apicache");
const { cacheInstance } = require("../config/cache");

class AdminProductController {

  async getAllAdminProducts(req, res) {
  try {

    const products = await Product.find()
      .populate("category", "name")
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      products,
    });

  } catch (err) {
    console.error(err);
  }
}


async pinProduct(req, res) {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { priority: 10 },
      { new: true }
    );

   cacheInstance.clear("products");  // 💥💥💥 THIS IS THE MAGIC LINE

    res.json({
      success: true,
      product,
    });

  } catch (err) {
    console.error(err);
  }
}

  // async unpinProduct(req, res) {
  //   try {
  //     const { productId } = req.params;

  //     const product = await ProductService.unpinProduct(productId);

  //     res.status(200).json({
  //       message: "Product unpinned successfully",
  //       product,
  //     });

  //   } catch (error) {
  //     console.error("UNPIN PRODUCT ERROR →", error.message);
  //     res.status(400).json({ error: error.message });
  //   }
  // }

  async unpinProduct(req, res) {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { priority: 0 },
      { new: true }
    );

   cacheInstance.clear("products");   // 💥💥💥 MUST

    res.json({
      success: true,
      product,
    });

  } catch (err) {
    console.error(err);
  }
}

  // async updatePriority(req, res) {
  //   try {
  //     const { productId } = req.params;
  //     const { priority } = req.body;

  //     if (priority === undefined) {
  //       return res.status(400).json({ error: "Priority required" });
  //     }

  //     const product = await ProductService.updatePriority(productId, Number(priority));

  //     res.status(200).json({
  //       message: "Priority updated",
  //       product,
  //     });

  //   } catch (error) {
  //     console.error("PRIORITY UPDATE ERROR →", error.message);
  //     res.status(400).json({ error: error.message });
  //   }
  // }


  async updatePriority(req, res) {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { priority: req.body.priority },
      { new: true }
    );

    cacheInstance.clear("products");   // 💥💥💥

    res.json({
      success: true,
      product,
    });

  } catch (err) {
    console.error(err);
  }
}

}

module.exports = new AdminProductController();
