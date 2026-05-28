import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { useState } from "react";
import { setPriceRange } from "../../features/filterBySlice";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export const PriceRange = ({ setCheckedPriceRangeDOM }) => {
  const [isPriceSectionOpen, setIsPriceSectionOpen] = useState(true);

  const dispatch = useDispatch();

  // LOOP THROUGH THE DESCENDANTS WHILE SKIPPING THE EVENT TARGET AND GET THE CHECKBOXES DOM
  const handleCheckedPrice = (e) => {
    // Get all price range checkboxes from the entire form
    const allCheckboxes = document.querySelectorAll('input[name="priceRange"]');
    
    // Uncheck all checkboxes except the current one
    allCheckboxes.forEach((checkbox) => {
      if (checkbox !== e.target) {
        checkbox.checked = false;
      }
    });

    if (e.target.checked) {
      dispatch(setPriceRange(e.target.value));
      setCheckedPriceRangeDOM(e.target);
    } else {
      dispatch(setPriceRange(null));
      setCheckedPriceRangeDOM(null);
    }
  };

  return (
    <article className="flex flex-col md:gap-5 tablet:gap-5 gap-4 w-[100%] mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg tablet:text-xl font-bold">Giá</h3>
        {isPriceSectionOpen ? (
          <RiArrowDropUpLine
            className=" w-8 h-6 cursor-pointer"
            onClick={() => setIsPriceSectionOpen(!isPriceSectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsPriceSectionOpen(!isPriceSectionOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {isPriceSectionOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex flex-col gap-2 md:gap-3 tablet:gap-3   text-base tablet:text-lg md:text-lg"
            onChange={(e) => handleCheckedPrice(e)}
          >
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="priceRange" value="0-100000" id="0-100000" />
              <label htmlFor="0-100000" className="flex gap-[1px] items-center cursor-pointer">
                <span>0₫</span>
                <span>-</span> <span>100.000₫</span>
              </label>
            </div>
            <div className="flex gap-2 md:gap-3 tablet:gap-3 items-center">
              <input type="checkbox" name="priceRange" value="100000-500000" id="100000-500000" />
              <label htmlFor="100000-500000" className="flex gap-[1px] items-center cursor-pointer">
                <span>100.000₫</span>
                <span>-</span> <span>500.000₫</span>
              </label>
            </div>
            <div className="flex gap-2 md:gap-3 tablet:gap-3 items-center">
              <input type="checkbox" name="priceRange" value="500000-1000000" id="500000-1000000" />
              <label htmlFor="500000-1000000" className="flex gap-[1px] items-center cursor-pointer">
                <span>500.000₫</span>
                <span>-</span> <span>1.000.000₫</span>
              </label>
            </div>
            <div className="flex gap-2 md:gap-3 tablet:gap-3 items-center">
              <input type="checkbox" name="priceRange" value="1000000-" id="1000000-" />
              <label htmlFor="1000000-" className="flex gap-[1px] items-center cursor-pointer">
                <span>1.000.000₫</span>
                <span>+</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
