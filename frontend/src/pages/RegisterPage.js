import { RegisterUser } from "../features/authSlice/register";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateEmail } from "../utils/emailRegexValidation";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FullpageSpinnerLoader } from "../components/loaders/spinnerIcon";
import { primaryBtnVariant } from "../utils/animation";
import { cartTextChangeVariant } from "../utils/animation";
import { motion } from "framer-motion";

export const RegisterPage = () => {
  // check if input type=password is in password mode or text mode
  const [isInputValueInPassword, setIsInputValueInPassword] = useState(true);
  const [isInputValueInConfirmPassword, setIsInputValueInConfirmPassword] = useState(true);

  const [registerDetails, setRegisterDetails] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isLoading } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    let gmailInputDOM = e.currentTarget.querySelector("input[type='email']");
    let passwordInputDOM = e.currentTarget.querySelectorAll("input[type='password'], input[data-type='password']")[0];
    let confirmPasswordInputDOM = e.currentTarget.querySelectorAll("input[type='password'], input[data-type='password']")[1];

    if (!validateEmail(gmailInputDOM.value)) {
      gmailInputDOM.parentElement.nextElementSibling.style.display = "block";
      return;
    }

    if (registerDetails.password !== registerDetails.confirmPassword) {
      confirmPasswordInputDOM.parentElement.nextElementSibling.style.display = "block";
      return;
    } else {
      confirmPasswordInputDOM.parentElement.nextElementSibling.style.display = "none";
    }

    let response = await dispatch(RegisterUser(registerDetails));

    if (!response.error) {
      navigate("/login");
      setRegisterDetails({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <section className="mt-16 flex justify-center items-center  max-w-[340px] text-base  w-[92%] mx-auto">
      <form className="flex flex-col gap-4 w-[100%] " onSubmit={onSubmit}>
        <h1 className="text-4xl font-bold text-center  font-RobotoCondensed">Tạo tài khoản mới</h1>
        <div className="w-100% mt-4">
          <div className="authPage-input-container border-[1px] rounded relative border-secondaryColor focus-within:outline-none focus-within:border-primaryColor  w-[100%] h-[56px] ">
            <input
              className="appearance-none absolute pl-3 top-0 left-0 focus:outline-none w-[100%] h-[100%] authPage-input bg-transparent"
              type="text"
              placeholder=" "
              name=""
              minLength="3"
              required
              value={registerDetails.fullName}
              onChange={(e) =>
                setRegisterDetails((prevData) => {
                  return { ...prevData, fullName: e.target.value };
                })
              }
            />
            <label htmlFor="" className="absolute  top-[0.8rem] left-3 z-[-1]">
              Họ tên
            </label>
          </div>
        </div>
        <div className="w-100% ">
          <div className="authPage-input-container border-[1px] rounded relative border-secondaryColor focus-within:outline-none focus-within:border-primaryColor  w-[100%] h-[56px] ">
            <input
              className="appearance-none absolute pl-3 top-0 left-0 focus:outline-none w-[100%] h-[100%] authPage-input bg-transparent"
              type="tel"
              placeholder=" "
              name=""
              required
              value={registerDetails.phoneNumber}
              onChange={(e) =>
                setRegisterDetails((prevData) => {
                  return { ...prevData, phoneNumber: e.target.value };
                })
              }
            />
            <label htmlFor="" className="absolute  top-[0.8rem] left-3 z-[-1]">
              Số điện thoại
            </label>
          </div>
        </div>
        <div className="w-[100%] ">
          <div className="authPage-input-container border-[1px] rounded relative border-secondaryColor focus-within:outline-none focus-within:border-primaryColor  w-[100%] h-[56px]">
            <input
              className="appearance-none absolute pl-3 top-0 left-0 focus:outline-none w-[100%] h-[100%] authPage-input bg-transparent"
              type="email"
              placeholder=" "
              required
              name=""
              value={registerDetails.email}
              onChange={(e) => {
                setRegisterDetails((prevData) => {
                  return { ...prevData, email: e.target.value };
                });
                if (validateEmail(e.target.value)) {
                  e.target.parentElement.nextElementSibling.style.display = "none";
                }
              }}
            />
            <label htmlFor="" className="absolute  top-[0.8rem] left-3 z-[-1]">
              Địa chỉ email
            </label>
          </div>
          <span className="text-[#fca311] font-RobotoCondensed hidden">Vui lòng nhập địa chỉ email hợp lệ</span>
        </div>
        <div className="w-[100%]">
          <div className="authPage-input-container border-[1px] rounded relative border-secondaryColor focus-within:outline-none focus-within:border-primaryColor  w-[100%] h-[56px]">
            <input
              className="appearance-none absolute pl-3 top-0 left-0 focus:outline-none w-[100%] h-[100%] authPage-input bg-transparent"
              type={`${isInputValueInPassword ? "password" : "text"}`}
              required
              placeholder=" "
              name=""
              minLength="8"
              value={registerDetails.password}
              onChange={(e) =>
                setRegisterDetails((prevData) => {
                  return { ...prevData, password: e.target.value };
                })
              }
            />
            <label htmlFor="" className="absolute  top-[0.8rem] left-3 z-[-1]">
              Mật khẩu
            </label>
            {isInputValueInPassword ? (
              <FaEye
                className="w-6 h-6 absolute top-[0.8rem] right-4"
                onClick={() => setIsInputValueInPassword(!isInputValueInPassword)}
              />
            ) : (
              <FaEyeSlash
                className="w-6 h-6 absolute top-[0.8rem] right-4"
                onClick={() => setIsInputValueInPassword(!isInputValueInPassword)}
              />
            )}
          </div>
        </div>
        <div className="w-[100%]">
          <div className="authPage-input-container border-[1px] rounded relative border-secondaryColor focus-within:outline-none focus-within:border-primaryColor  w-[100%] h-[56px]">
            <input
              className="appearance-none absolute pl-3 top-0 left-0 focus:outline-none w-[100%] h-[100%] authPage-input bg-transparent"
              type={`${isInputValueInConfirmPassword ? "password" : "text"}`}
              required
              placeholder=" "
              name=""
              minLength="8"
              value={registerDetails.confirmPassword}
              onChange={(e) =>
                setRegisterDetails((prevData) => {
                  return { ...prevData, confirmPassword: e.target.value };
                })
              }
            />
            <label htmlFor="" className="absolute  top-[0.8rem] left-3 z-[-1]">
              Xác nhận mật khẩu
            </label>
            {isInputValueInConfirmPassword ? (
              <FaEye
                className="w-6 h-6 absolute top-[0.8rem] right-4"
                onClick={() => setIsInputValueInConfirmPassword(!isInputValueInConfirmPassword)}
              />
            ) : (
              <FaEyeSlash
                className="w-6 h-6 absolute top-[0.8rem] right-4"
                onClick={() => setIsInputValueInConfirmPassword(!isInputValueInConfirmPassword)}
              />
            )}
          </div>
          <span className="text-[#fca311] font-RobotoCondensed hidden">Mật khẩu không khớp</span>
        </div>
        <motion.button
          initial="initial"
          whileTap="click"
          variants={primaryBtnVariant}
          className="h-[56px] mt-3 bg-primaryColor w-[100%] rounded border-transparent text-white text-[18px]  font-medium"
          type="submit"
        >
          <motion.span
            className="w-[100%] h-[100%] flex items-center justify-center"
            initial="initial"
            whileTap="animate"
            variants={cartTextChangeVariant}
          >
            {isLoading ? <>Đang đăng ký</> : "Đăng ký"}
          </motion.span>
        </motion.button>
        <span className=" text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primaryColor">
            Đăng nhập
          </Link>
        </span>

        {isLoading && <FullpageSpinnerLoader />}
      </form>
    </section>
  );
};
