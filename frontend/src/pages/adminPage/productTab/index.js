import React, { useEffect, useState } from "react";
import { IoAddOutline, IoSearchSharp } from "react-icons/io5";
import { AddNewProduct } from "./addNewProduct";
import { SingleProductTableCell } from "./singleProductTableCell";
import axios from "axios";
import { PaginationSectionForProductsAdminPage } from "./paginationForProductsAdmin";

export const ProductManagement = () => {
  const [isAddNewProductClicked, setIsAddNewProductClicked] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const [lowStockProductsParams, setLowStockProductsParams] = useState({
    lowStockProducts: [],
    productsLength: 0,
    pageNo: 1,
    perPage: 10,
    isError: false,
  });
  const [getLowStockProductsLoader, setLowStockProductsLoader] = useState(false);

  const [searchParameters, setSearchParameters] = useState({ searchedProductName: "", pageNo: 1, perPage: 10 });
  const [searchedProductDataAdminPage, setSearchedProductDataAdminPage] = useState({
    productsSearchedFor: [],
    productsLength: 0,
  });
  const [closeSearchList, setCloseSearchList] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { productsSearchedFor, productsLength } = searchedProductDataAdminPage;

  useEffect(() => {
    fetchLowStockProducts(lowStockProductsParams);
  }, []);

  const fetchLowStockProducts = async (lowStockProductsParams) => {
    const { pageNo, perPage } = lowStockProductsParams;
    setLowStockProductsLoader(true);

    try {
      const {
        data: { products, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/sortByLowStockProducts`, {
        params: {
          pageNo: pageNo,
          perPage: perPage,
        },
      });

      setLowStockProductsParams((prevData) => {
        return { ...prevData, lowStockProducts: products, productsLength };
      });
      setLowStockProductsLoader(false);
    } catch (error) {
      setLowStockProductsParams((prevData) => {
        return { ...prevData, isError: true };
      });
      setLowStockProductsLoader(false);
    }
  };

  const searchProductFetch = async (searchParameters) => {
    const { searchedProductName, pageNo, perPage } = searchParameters;
    setCloseSearchList(false);
    setIsSearchLoading(true);
    try {
      const {
        data: { product, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/searchProducts`, {
        params: {
          title: searchedProductName,
          pageNo: pageNo,
          perPage: perPage,
        },
      });

      setSearchedProductDataAdminPage({ productsSearchedFor: product, productsLength });

      setIsSearchLoading(false);
      return product;
    } catch (error) {
      setSearchedProductDataAdminPage({ productsSearchedFor: [], productsLength: 0 });
      setIsSearchLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-lightestPrimaryColor via-white to-lightestSecondaryColor px-4 md:px-8 py-8">
      <AddNewProduct {...{ isAddNewProductClicked, setIsAddNewProductClicked }} />

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-RobotoSlab font-bold text-secondaryColor mb-3">Quản lý sản phẩm</h1>
        <p className="text-lg text-gray-600 font-OpenSans">Quản lý danh mục và kho hàng sản phẩm của bạn</p>
      </div>

      {/* Add New Product Button */}
      <div className="mb-12">
        <button
          onClick={() => setIsAddNewProductClicked(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-primaryColor to-darkPrimaryColor hover:shadow-lg text-white font-RobotoCondensed font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
        >
          <IoAddOutline className="w-6 h-6" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor mb-12">
        <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-6">Tìm kiếm sản phẩm</h2>
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <IoSearchSharp className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border-2 border-neutralColor rounded-lg font-OpenSans text-secondaryColor placeholder-gray-400 focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor focus:ring-opacity-50 transition-all"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchParameters.searchedProductName}
              onChange={(e) => setSearchParameters({ ...searchParameters, searchedProductName: e.target.value })}
            />
          </div>
          <button
            onClick={() => searchProductFetch(searchParameters)}
            className="bg-gradient-to-r from-primaryColor to-darkPrimaryColor hover:shadow-lg text-white font-RobotoCondensed font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
          >
            Tìm kiếm
          </button>
          {!closeSearchList && (
            <button
              onClick={() => {
                setCloseSearchList(true);
                setSearchParameters({ ...searchParameters, searchedProductName: "" });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-RobotoCondensed font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {!closeSearchList && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor mb-12">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-6">Kết quả tìm kiếm</h2>
          
          {isSearchLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-primaryColor border-t-secondaryColor rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-OpenSans">Đang tìm kiếm sản phẩm...</p>
              </div>
            </div>
          ) : productsLength > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold">ID</th>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold">Image</th>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold">Name</th>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Price</th>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Stock</th>
                      <th className="px-6 py-4 font-RobotoCondensed font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsSearchedFor.map((products) => {
                      return <SingleProductTableCell {...{ products }} key={products._id} />;
                    })}
                  </tbody>
                </table>
              </div>

              {productsLength > 0 && (
                <div className="mt-6">
                  <PaginationSectionForProductsAdminPage
                    productsLength={productsLength}
                    asyncFnParamState={searchParameters}
                    asyncFn={searchProductFetch}
                    setAsyncFnParamState={setSearchParameters}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-OpenSans text-lg">No products found matching your search</p>
            </div>
          )}
        </div>
      )}

      {/* Low Stock Products */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutralColor">
        <div className="mb-8">
          <h2 className="text-2xl font-RobotoSlab font-bold text-secondaryColor mb-2">Inventory Status</h2>
          <p className="text-gray-600 font-OpenSans">Products sorted by stock level (lowest to highest)</p>
        </div>

        {getLowStockProductsLoader ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-primaryColor border-t-secondaryColor rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-OpenSans">Loading inventory...</p>
            </div>
          </div>
        ) : lowStockProductsParams.productsLength > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-secondaryColor to-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">ID</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Image</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Name</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Price</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold text-right">Stock</th>
                    <th className="px-6 py-4 font-RobotoCondensed font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProductsParams.lowStockProducts.map((products) => {
                    return <SingleProductTableCell {...{ products }} key={products._id} />;
                  })}
                </tbody>
              </table>
            </div>

            {lowStockProductsParams.productsLength > 0 && (
              <div className="mt-6">
                <PaginationSectionForProductsAdminPage
                  productsLength={lowStockProductsParams.productsLength}
                  asyncFnParamState={lowStockProductsParams}
                  asyncFn={fetchLowStockProducts}
                  setAsyncFnParamState={setLowStockProductsParams}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            {lowStockProductsParams.isError ? (
              <div>
                <p className="text-gray-500 font-OpenSans text-lg mb-4">Error loading products</p>
                <button
                  onClick={() => fetchLowStockProducts(lowStockProductsParams)}
                  className="bg-primaryColor hover:bg-darkPrimaryColor text-white font-RobotoCondensed font-bold py-2 px-6 rounded-lg transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              <p className="text-gray-500 font-OpenSans text-lg">No products found</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow duration-300 border border-opacity-20 border-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className="opacity-90">{icon}</div>
    </div>
    <p className="text-sm font-OpenSans opacity-90 mb-2">{title}</p>
    <p className="text-4xl font-RobotoSlab font-bold">{value}</p>
  </div>
);
