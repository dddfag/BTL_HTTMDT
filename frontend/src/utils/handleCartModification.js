import { store } from "../store";
import { setCart } from "../features/wishlistAndCartSlice";
import { toast } from "react-toastify";

export const handleCartModification = (_id, dispatch, productQuantity, isObjInCart, productData = null) => {
  const { allProductsData } = store.getState().productsData;
  const { cart } = store.getState().wishlistAndCartSection;

  let newCart;
  // if the product is in the cart and productQuantity param  is true-it means u wanna add more while if it doesnt u wanna remove all.
  //  if the product is not in the cart  and productQuantity param  is true- it means u wanna add the specified quantity while if it isnt,it means u wanna add 1
  switch (isObjInCart) {
    case true:
      if (!productQuantity) {
        const filteredCart = cart.filter((productsData) => productsData._id !== _id);
        newCart = [...filteredCart];
        toast("Product has been removed from cart", {
          type: "success",
          autoClose: 2000,
        });
      } else if (productQuantity) {
        // ON QUANTITY CHANGE
        newCart = [...cart];

        for (let key of newCart) {
          if (key._id === _id) {
            const index = newCart.indexOf(key);
            newCart[index] = { ...key, quantity: newCart[index].quantity + parseInt(productQuantity) };
          }
        }
        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      }
      break;

    case false:
      if (!productQuantity) {
        // Try to use provided productData first, then fall back to searching
        let currentCartedProduct = productData || allProductsData.find((productsData) => productsData._id === _id);

        // Final fallback: if not found anywhere, try to find in cart
        if (!currentCartedProduct && cart.length > 0) {
          currentCartedProduct = cart.find((productsData) => productsData._id === _id);
        }

        if (!currentCartedProduct) {
          toast("Error: Product not found. Please refresh and try again.", {
            type: "error",
            autoClose: 2000,
          });
          return;
        }

        currentCartedProduct = {
          ...currentCartedProduct,
          quantity: 1,
        };
        newCart = [...cart, currentCartedProduct];

        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      } else if (productQuantity) {
        // Try to use provided productData first, then fall back to searching
        let currentCartedProduct = productData || allProductsData.find((productsData) => productsData._id === _id);

        // Final fallback: if not found anywhere, try to find in cart
        if (!currentCartedProduct && cart.length > 0) {
          currentCartedProduct = cart.find((productsData) => productsData._id === _id);
        }

        if (!currentCartedProduct) {
          toast("Error: Product not found. Please refresh and try again.", {
            type: "error",
            autoClose: 2000,
          });
          return;
        }

        currentCartedProduct = {
          ...currentCartedProduct,
          quantity: parseInt(productQuantity),
        };
        newCart = [...cart, currentCartedProduct];

        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      }

      break;
    default:
      break;
  }

  dispatch(setCart(newCart));
};
