const user = require('../model/user_model')
const product = require("../model/product_model")
const cart_model = require("../model/cart_model")

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

    // Find the cart for this user
    let cart = await cart_model.findOne({ user: userId })

    // If no cart exists, create one
    if (!cart) {
      cart = new cart_model({
        user: userId,
        products: [{ product: productId, quantity: quantity }]
      })
    } else {
      // Check if product already exists in cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      )

      if (existingProductIndex > -1) {
        // Product exists → update its quantity
        cart.products[existingProductIndex].quantity += quantity
      } else {
        // Product doesn’t exist → push it into array
        cart.products.push({ product: productId, quantity: quantity })
      }
    }

    const savedCart = await cart.save()
    res.json({ message: "Product added to cart", cart: savedCart })

  } catch (error) {
    res.json({ error: error.message })
  }
}

// Remove a product from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find cart belonging to the user
        let cart = await cart_model.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove the product manually using array filter
        cart.products = cart.products.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });

        /*
        🔹 OPTIONAL METHOD (Alternative Way):
        Instead of loading the cart into memory and filtering manually,
        you can use MongoDB's $pull operator directly.

        Example:
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { products: { product: productId } } },
            { new: true } // return the updated cart
        );

        res.status(200).json({ message: "Product removed from cart", cart: updatedCart });

        ✅ Advantage: One direct database operation, faster and cleaner
        ❌ Trade-off: Less flexibility if you need to do additional logic in JS
        */
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user’s cart
const getCart = async (req, res,next) => {
    try {
        const { userId } = req.params;

        const cart = await cart_model.findOne({ user: userId })
            .populate("products.product");  // populate product details

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

// Update product quantity in cart
const updateQuantity = async (req, res,next) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await cart_model.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        next(error);
    }
};


// Clear all products from cart
const clearCart = async (req, res,next) => {
    try {
        const { userId } = req.body;

        let cart = await cart_model.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = []; // empty the array
        await cart.save();

        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        next(error);
    }
};


module.exports = {addToCart,removeFromCart,getCart,updateQuantity,clearCart}
