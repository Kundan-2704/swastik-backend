
const ProductService = require("../service/ProductService.js");

const Product = require("../model/Product.js");



class SellerProductController {




  async getProductBySellerId(req, res) {
    try {
      const seller = req.seller;

      // 👇 FRONTEND SE AANE WALA
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const products = await ProductService.getProductBySeller(
        seller._id,
        page,
        limit
      );


      return res.status(200).json(products);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }




  async createProduct(req, res) {
    try {
      const seller = req.seller;

      if (!seller) {
        return res.status(401).json({ message: "Seller not authorized" });
      }

      const productData = {
        ...req.body,
        seller: seller._id,

        // 🟢 SAFE DEFAULTS (NEW SCHEMA)
        colors: req.body.colors || [],
        sizes: req.body.sizes || [],
        details: req.body.details || {},
        delivery: req.body.delivery || {},
        faqs: req.body.faqs || [],
        craftStory: req.body.craftStory || "",

        inStock: req.body.quantity > 0,
      };
      const product = await ProductService.createProduct(req.body, req.seller);

      return res.status(201).json(product);

    } catch (error) {
      console.error("CREATE PRODUCT ERROR →", error.message);
      return res.status(400).json({ error: error.message });
    }
  }


  async deleteProduct(req, res) {
    try {
      const productId = req.params.productId;

      await ProductService.deleteProduct(productId);

      return res.status(200).json({
        message: "Product deleted successfully",
        productId,
      });

    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }


  async updateProduct(req, res) {
    try {
      const { productId } = req.params;

      /* ================= BASIC FIELDS ================= */

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        craftStory: req.body.craftStory,
        mrpPrice: Number(req.body.mrpPrice),
        sellingPrice: Number(req.body.sellingPrice),
        quantity: Number(req.body.quantity),
      };

      /* ================= OPTIONAL CATEGORY ================= */

      if (req.body.category) updateData.category = req.body.category;
      if (req.body.category2) updateData.category2 = req.body.category2;
      if (req.body.category3) updateData.category3 = req.body.category3;

      /* ================= JSON FIELDS ================= */

      if (req.body.sizes) {
        updateData.sizes = JSON.parse(req.body.sizes);
      }

      if (req.body.colors) {
        updateData.colors = JSON.parse(req.body.colors);
      }

      if (req.body.details) {
        updateData.details = JSON.parse(req.body.details);
      }

      /* ================= IMAGE LOGIC (SAFE & FINAL) ================= */

      let existingImages = null;
      let newImages = [];

      // 🔹 Existing images (only if frontend sent it)
      if (req.body.existingImages !== undefined) {
        existingImages = JSON.parse(req.body.existingImages);
      }

      // 🔹 Newly uploaded images
      if (req.files && req.files.length > 0) {
        newImages = await uploadToCloudinary(req.files);
      }

      // 🔹 Update images ONLY if user changed images
      if (existingImages !== null || newImages.length > 0) {
        updateData.images = [
          ...(existingImages || []),
          ...newImages,
        ];
      }

      /* ================= UPDATE PRODUCT ================= */

      const product = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      res.status(200).json(product);

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR 👉", error);
      res.status(400).json({ message: error.message });
    }
  }


  /* ================= 🔥 SINGLE PRODUCT STOCK UPDATE (NEW) ================= */

  async updateProductStock(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: "Valid quantity required" });
      }

      const product = await Product.findOne({
        _id: productId,
        seller: req.seller._id,
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.quantity = Number(quantity);
      product.inStock = Number(quantity) > 0;

      await product.save();

      return res.status(200).json(product);

    } catch (error) {
      console.error("STOCK UPDATE ERROR →", error.message);
      return res.status(400).json({ message: error.message });
    }
  }


  async bulkUpdateStock(req, res) {

    try {
      const { productIds, quantity } = req.body;

      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: "Product IDs required" });
      }

      if (quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      await Product.updateMany(
        { _id: { $in: productIds } },
        {
          $set: {
            quantity,
            inStock: quantity > 0,
          },
        }
      );

      const updatedProducts = await Product.find({
        _id: { $in: productIds },
      });

      return res.status(200).json(updatedProducts);

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }



  async getProductById(req, res) {
    try {
      const product = await ProductService.findProductById(req.params.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);

    } catch (error) {
      console.error("GET PRODUCT BY ID ERROR →", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  async searchProduct(req, res) {
    try {
      const query = res.query.q
      const product = await ProductService.searchProduct(query)
      return res.status(200).json(product)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }




  async getAllProduct(req, res) {
    try {
      const product = await ProductService.getAllProducts(req.query)
      return res.status(200).json(product)
    } catch (error) {
      console.error("GET ALL PRODUCT ERROR →", error.message);
      res.status(400).json({ error: error.message })
    }
  }



}


module.exports = new SellerProductController()

