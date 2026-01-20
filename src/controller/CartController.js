// const CartItemService = require("../service/CartItemService.js");
// const CartService = require("../service/CartService.js");
// const ProductService = require("../service/ProductService.js");





// class CartController {
//     async findUserCartHandler(req, res) {
//         try {
//             const user = await req.user;

//             const cart = await CartService.findUserCart(user);

//             res.status(200).json(cart)

//         } catch (error) {
//             res.status(500).json({ error: error.message })
//         }
//     }

//     async addItemToCart(req, res) {
//         try {
//             const user = await req.user;

//             const product = await ProductService.findProductById(req.body.productId)

//             const cartItem = await CartService.addCartItem(
//                 user,
//                 product,
//                 req.body.size,
//                 req.body.quantity
//             )

//             res.status(200).json(cartItem)

//         } catch (error) {
//             res.status(500).json({ error: error.message })
//         }
//     }

//     async deleteCartItemHandler(req, res) {
//         try {
//             const user = await req.user;

//             await CartItemService.removeCartItem(user._id, req.params.cartItemId)

//             res.status(202).json({ message: "Item removed from cart" })

//         } catch (error) {
//             res.status(500).json({ error: error.message })
//         }
//     }

//     async updateCartItemHandler(req, res) {
//         try {
//             const cartItemId = req.params.cartItemId
//             const { quantity } = req.body;
//             const user = await req.user;

//             let updateCartItem;
//             if (quantity > 0) {
//                 updateCartItem = await CartItemService.updateCartItem(
//                     user._id,
//                     cartItemId,
//                     { quantity }
//                 )
//             }

//             res.status(202).json(updateCartItem)

//         } catch (error) {
//             res.status(500).json({ error: error.message })
//         }
//     }

// }


// module.exports = new CartController();



const CartItemService = require("../service/CartItemService.js");
const CartService = require("../service/CartService.js");
const ProductService = require("../service/ProductService.js");

class CartController {

  async findUserCartHandler(req, res) {
    try {
      const user = req.user; // ✅ FIX

      const cart = await CartService.findUserCart(user._id);

      return res.status(200).json(cart);

    } catch (error) {
      console.error("❌ FIND CART ERROR →", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async addItemToCart(req, res) {
    try {
      const user = req.user; // ✅ FIX

      const product = await ProductService.findProductById(
        req.body.productId
      );

      const cartItem = await CartService.addCartItem(
        user._id,
        product,
        req.body.size,
        req.body.quantity
      );

      return res.status(200).json(cartItem);

    } catch (error) {
      console.error("❌ ADD CART ITEM ERROR →", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteCartItemHandler(req, res) {
    try {
      const user = req.user; // ✅ FIX

      await CartItemService.removeCartItem(
        user._id,
        req.params.cartItemId
      );

      return res.status(202).json({
        message: "Item removed from cart"
      });

    } catch (error) {
      console.error("❌ DELETE CART ITEM ERROR →", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateCartItemHandler(req, res) {
    try {
      const user = req.user; // ✅ FIX
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be greater than 0"
        });
      }

      const updatedItem = await CartItemService.updateCartItem(
        user._id,
        cartItemId,
        { quantity }
      );

      return res.status(202).json(updatedItem);

    } catch (error) {
      console.error("❌ UPDATE CART ITEM ERROR →", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
