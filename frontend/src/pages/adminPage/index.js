import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { toast } from "react-toastify";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import { fetchIsUserAnAdmin } from "../../features/adminSlice/checkIfUserIsAnAdmin";

export const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(true);
  const [adminName, setAdminName] = useState("");

  const [currentTabInAdminPage, setCurrentTabInAdminPage] = useState("Bảng điều khiển");

  const { checkingAdminStatusLoader } = useSelector((state) => state.adminOperations);

  useEffect(() => {
    let tabPath = location.pathname.replace("/administrator/", "");
    let tabName = tabPath.includes("management") ? tabPath : tabPath.replace("-", " ");
    
    // Convert English paths to Vietnamese
    const pathTranslations = {
      "dashboard": "Bảng điều khiển",
      "revenues": "Doanh thu",
      "product Management": "Quản lý sản phẩm",
      "user Management": "Quản lý người dùng",
      "order Management": "Quản lý đơn hàng"
    };
    
    tabName = pathTranslations[tabName] || tabName;
    setCurrentTabInAdminPage(tabName);
  }, [location.pathname, location]);

  // check if user is authorized to view the page
  useEffect(() => {
    const checkIfUserIsAdminFN = async () => {
      const { payload } = await dispatch(fetchIsUserAnAdmin());

      if (payload === "success") {
        setIsAdmin(true);
        // Get the admin's username from localStorage
        const userData = JSON.parse(localStorage.getItem("UserData"));
        setAdminName(userData?.username || userData?.email || "Admin");
      } else {
        navigate("/login");
        setIsAdmin(false);
      }
    };

    checkIfUserIsAdminFN();
  }, []);

  const handleAdminPageTabChange = (e) => {
    if (e.target.dataset.tabpath) {
      e.currentTarget.classList.remove("active-AdminPage-tab");
    }
  };

  const logoutBtnClick = async () => {
    try {
      await localStorage.clear("userData");

      toast("Người dùng đã đăng xuất thành công", {
        type: "success",
        autoClose: 3000,
        position: "top-center",
      });
      navigate("/login");
    } catch (error) {
      toast("Có gì đó không đúng", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  if (checkingAdminStatusLoader) {
    return <FullpageSpinnerLoader />;
  } else {
    return (
      <>
        <div className="flex mx-[4%] justify-between items-start mt-16  md:mx-[4%] lg:mx-[2%] xl:mx-[4%] tablet:mx-[6%] ">
          <article className="w-[50%] tablet:w-[35%] lg:w-[30%] md:w-[30%] bg-[#ffffff] max-w-[264px] mb-16 flex-col flex gap-2">
            <div
              className="flex justify-between h-14 rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)] items-center px-[10%] cursor-pointer bg-lightPrimaryColor text-white"
              onClick={(e) => {
                e.currentTarget.nextElementSibling.classList.toggle("active-AdminPage-tab");
              }}
            >
              <h2>{currentTabInAdminPage}</h2>
              <IoIosArrowDown className="w-6 h-6" />
            </div>
            <div
              className="hidden flex-col rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]   py-4  gap-4 z-[200] px-[10%] sticky top-0 left-0 right-0 -mb-[17rem]  md:-mb-[14rem] bg-lightPrimaryColor text-white"
              onClick={handleAdminPageTabChange}
            >
              <Link to="dashboard">
                <li data-tabpath="Bảng điều khiển">Bảng điều khiển</li>
              </Link>
              <Link to="revenues">
                <li data-tabpath="Doanh thu">Doanh thu</li>
              </Link>
              <Link to="product-Management">
                <li data-tabpath="Quản lý sản phẩm">Quản lý sản phẩm</li>
              </Link>
              <Link to="user-Management">
                <li data-tabpath="Quản lý người dùng">Quản lý người dùng</li>
              </Link>
              <Link to="order-Management">
                <li data-tabpath="Quản lý đơn hàng">Quản lý đơn hàng</li>
              </Link>
            </div>
          </article>
          <div
            className="text-center w-[100px] h-9  hover:opacity-100 bg-lighterPrimaryColor text-[hsl(37,98%,53%)] cursor-pointer shadow-[0px_3px_8px_0px_rgba(0,0,0,0.1)]  rounded-md flex items-center justify-center"
            onClick={logoutBtnClick}
          >
            <span>Đăng xuất</span> &nbsp; &nbsp; <BiLogOut className="w-6 h-6 stroke-primaryColor" />
          </div>
        </div>
        {/* // nested routes jsx */}
        {/* redirection was done directly to prvenet manul acess of all nested */}
        <Outlet />
        {/* {isAdmin ? <Outlet /> : <Navigate to="/" />} */}
      </>
    );
  }
};

export default Index;
