import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import FooterSection from "../components/footerSection";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleCartModification } from "../utils/handleCartModification";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { ProductLoader } from "../components/loaders/productLoader";
import { motion } from "framer-motion";
import { primaryBtnVariant } from "../utils/animation";
import { RatingsDisplay } from "../components/ratingsSection/ratingsDisplay";
import { AddRating } from "../components/ratingsSection/addRating";
import { formatPriceVND } from "../utils/priceFormatter";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allProductsData, isLoading } = useSelector((state) => state.productsData);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [ratingsRefreshFlag, setRatingsRefreshFlag] = useState(0);

  const { productId } = useParams();
  const currentProduct = allProductsData.find((product) => product._id === productId);
  const { _id, title, price, image, description, discountPercentValue, categories, stock } = currentProduct || {
    _id: "",
    title: "",
    price: "",
    image: "",
    description: "",
    discountPercentValue: "",
    categories: "",
    stock: "",
  };

  //loop through and get the sub categories arr so it can be displayed as part of the details
  let subCategoriesArr = [];
  for (let key in categories) {
    if (categories[key].length > 0) subCategoriesArr.push(...categories[key]);
  }

  const handleAddToCartFn = () => {
    // Always add 1 product, pass currentProduct directly to ensure it's found
    handleCartModification(_id, dispatch, 1, isProductInCart, currentProduct);
  };

  // Checks if a the current product can be found in the wishlist and cart so as to be able to display the states in the ui
  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart);
  }, [cart, _id]);

  const buyNowFn = () => {
    // Add 1 product to cart and go to checkout
    handleCartModification(_id, dispatch, 1, isProductInCart, currentProduct);
    navigate("/checkout");
  };

  let discountedPrice = price - (price * discountPercentValue) / 100;
  if (isLoading) {
    return <ProductLoader />;
  }
  return (
    <motion.div
      initial={{ scale: 0 }}
      exit={{ scale: 0, rotate: 360, transition: { ease: "easeIn", duration: 0.5 } }}
      animate={{ scale: 1, rotate: 360, transition: { duration: 0.5, ease: "easeOut" } }}
      className="w-[100%] "
    >
      <div className="mt-12 w-[100%] h-auto bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center justify-between font-bold tablet:px-[6%] py-6 font-RobotoCondensed lg:col-span-full lg:row-span-1">
        <div className="flex gap-[4px] items-center text-4xl">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline capitalize">
            Trang chủ
          </li>
          <IoIosArrowBack />
          <li onClick={() => navigate("/shop")} className="hover:underline capitalize">
            Cửa hàng
          </li>
          <IoIosArrowBack />
          <span className=" capitalize">{title}</span>
        </div>
      </div>
      <section className="className my-20 mb-32 w-[92%] mx-auto gap-6 flex flex-col lg:flex-row  lg:gap-2 md:justify-between tablet:w-[88%] lg:w-[96%]">
        <div className="w-[100%] lg:mx-0 lg:basis-[50%] lg:h-max min-h-[320px] tablet:min-h-[450px] md:min-h-[500px] h-auto mx-auto bg-neutralColor relative flex justify-center items-center">
          <img src={image} alt="" className="w-auto max-w-[99%] h-auto  object-cover" />
          <div
            className={`absolute p-3 bg-[#ffffff] shadow-[0px_2px_8px_0px_#00000085] ease-in transition-colors cursor-pointer duration-300 rounded-[50%] top-[5%] right-[5%] z-[100] ${
              isWishlisted && "bg-primaryColor"
            }`}
          >
            <FiHeart
              className={`w-6 h-6 ${
                isWishlisted && "fill-primaryColor duration-200 ease-linear transition-colors stroke-white"
              }`}
              onClick={() => handleWishlistModification(_id, dispatch)}
            />
          </div>
        </div>
        <div className="lg:basis-[40%] mt-16 lg:mt-0 flex flex-col gap-6">
          <h2 className="text-[28px] font-bold tracking-[0.5px] capitalize">{title}</h2>

          {discountPercentValue > 0 ? (
            <div className="flex gap-2">
              <h3 className="font-bold text-[24px] md:text-[28px]  tracking-[1px]">
                {formatPriceVND(discountedPrice)}
              </h3>
              <h3 className="line-through tracking-[1px] text-[20px] md:text-[24px] ">{formatPriceVND(price)}</h3>
            </div>
          ) : (
            <h3 className="font-bold text-[24px] md:text-[28px] tracking-[1px]">{formatPriceVND(price)}</h3>
          )}
          <div className="flex gap-1 items-end">
            <h3 className="font-bold tracking-[0.5px] text-[20px]">Tồn kho :</h3>
            <span className="text-primaryColor  tracking-[0.7px] text-[18px] ">
              {stock < 0 ? "Hết hàng" : <strong>{stock}</strong>}
              {stock >= 0 && " còn trong kho"}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-[20px] tracking-[0.5px]">Mô tả</h2>
            <p className="leading-[150%] tracking-[0.5px]">
              {description || "No description available for this product."}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[20px] tracking-[0.5px]">Danh mục con :</h3>
            <div className="flex font-medium text-[18px]">
              {subCategoriesArr.map((category) => category).join(", ")}
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <motion.button
              initial="initial"
              whileTap="click"
              variants={primaryBtnVariant}
              className="text-white basis-[100%] tablet:basis-[45%] md:basis-[35%] lg:basis-[40%] bg-primaryColor font-semibold w-[100%] h-[50px]"
              onClick={handleAddToCartFn}
            >
              Thêm vào giỏ hàng
            </motion.button>

            <motion.button
              initial="initial"
              whileTap="click"
              variants={primaryBtnVariant}
              className="text-white bg-primaryColor font-semibold  w-[100%] basis-[100%] lg:basis-[40%] tablet:basis-[45%] md:basis-[35%] h-[50px] block"
              onClick={buyNowFn}
            >
              Mua ngay
            </motion.button>
          </div>
          <div className="flex-col flex gap-4">
            <h3 className="font-bold text-[20px] tracking-[0.5px]">Tùy chọn vận chuyển</h3>
            <div className="flex flex-col gap-2">
              <p className=" leading-[150%]">
                <span className="font-semibold text-[18px]">Vận chuyển tiêu chuẩn</span>
                &nbsp; (Giao hàng trong 7-10 ngày làm việc) - tốn $7.00 USD cho mỗi sản phẩm
              </p>
              <p className=" leading-[150%]">
                <span className="font-semibold text-[18px]">Vận chuyển nhanh</span>
                &nbsp; (Giao hàng trong 5-7 ngày làm việc) - tốn $7.00 USD cho mỗi sản phẩm
              </p>
              <p className="leading-[150%]">
                <span className="font-semibold text-[18px]">Vận chuyển miễn phí</span>
                &nbsp; (Giao hàng trong 11-13 ngày làm việc) - tốn 0 USD cho mỗi sản phẩm
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ratings Section */}
      <section className="w-[92%] mx-auto tablet:w-[88%] lg:w-[96%] mb-20">
        <RatingsDisplay key={ratingsRefreshFlag} productId={_id} />
        <AddRating 
          productId={_id} 
          onRatingAdded={() => setRatingsRefreshFlag(ratingsRefreshFlag + 1)}
        />
      </section>
      
      <FooterSection />
    </motion.div>
  );
};
