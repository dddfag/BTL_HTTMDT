import { setSortedAllProductsData, setSortedSearchedProductData } from "../features/productSlice";

export const handleSorting = (
  dispatch,
  sortingCriteria,
  allProductsData,
  NoOfProductsPerPage,
  currentPageNo,
  currentPagePathName
) => {
  let sortedArr;
  switch (sortingCriteria) {
    case "Default: Latest":
    case "Mặc định: Mới nhất":
      sortedArr = [...allProductsData].sort((a, z) => a.updatedAt.localeCompare(z.updatedAt));
      break;
    case "Oldest":
    case "Cũ nhất":
      sortedArr = [...allProductsData].sort((a, z) => z.updatedAt.localeCompare(a.updatedAt));
      break;
    case "Name: A-Z":
    case "Tên: A-Z":
      sortedArr = [...allProductsData].sort((a, z) => {
        let A = a.title.toUpperCase();
        let Z = z.title.toUpperCase();
        if (A > Z) {
          return 1;
        }
        if (A < Z) {
          return -1;
        }
        return 0;
      });
      break;
    case "Name: Z-A":
    case "Tên: Z-A":
      sortedArr = [...allProductsData].sort((a, z) => {
        let A = a.title.toUpperCase();
        let Z = z.title.toUpperCase();
        if (A > Z) {
          return -1;
        }
        if (A < Z) {
          return 1;
        }
        return 0;
      });
      break;
    case "Price: low to high":
    case "Giá: thấp đến cao":
      sortedArr = [...allProductsData].sort((a, z) => a.price - z.price);
      break;
    case "Price: high to low":
    case "Giá: cao đến thấp":
      sortedArr = [...allProductsData].sort((a, z) => z.price - a.price);
      break;
    default:
      break;
  }

  currentPagePathName === "/shop" && dispatch(setSortedAllProductsData(sortedArr));
  currentPagePathName === "/search" && dispatch(setSortedSearchedProductData(sortedArr));
};

// SORT THE 'ALLPRODUCTDATA' AT THE START OF THE APP AND ON CHANGE OF THE 'SORTINGCRITERIA' AND DISPATCH THE SORTED ARRAY INTO THE 'SORTEDALLPRODUCT'
