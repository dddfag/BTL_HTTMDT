import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { FiInstagram } from "react-icons/fi";
import { BsGithub } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import logoOrange from "../../logoOrange.png";

export const Footer = () => {
  return (
    <footer className="w-[100%] px-[4%]  tablet:px-[6%] bg-secondaryColor text-white flex flex-col items-center gap-6 pt-64 pb-10 -mt-48">
      <div className="w-full">
        <img src={logoOrange} alt="" className="w-[120px] h-auto" />
        <p className=" md:w-[80%] lg:w-[60%]">
          Nâng cấp nhà và văn phòng của bạn với bộ sưu tập nội thất và trang trí được lựa chọn của chúng tôi.{" "}
        </p>
      </div>
      <article className="w-full lg:flex lg:items-start lg:justify-between gap-4 xs:w-[60%] ">
        <div className="flex flex-col items-start gap-4 md:w-[70%] lg:basis-[30%]">
          <ul className="flex gap-6"> 
            <IoLocationOutline className="w-9 h-9  stroke-primaryColor" />
            <li>
              AuFFurinc _ 121 Tran Phu _ Ha Dong _ Ha Noi _ Viet Nam.{" "}
            </li>
          </ul>
          <ul className="flex gap-6">
            <FiMail className="w-6 h-6 stroke-primaryColor" />
            <li>auFURFurniture@gmail.com</li>
          </ul>
          <ul className="flex gap-6">
            <FiPhoneCall className="w-6 h-6 stroke-primaryColor" />
            <li>+84 961 872 543</li>
          </ul>
        </div>
        <div className="flex flex-col w-[100%] gap-6 mt-8 lg:mt-0 tablet:flex-wrap md:flex-wrap md:justify-between tablet:flex-row md:flex-row tablet:justify-between md:w-[70%] lg:-[60%] lg:justify-evenly lg:gap-8">
          <div className="tablet:basis-[45%]">
            <h3 className="text-[18px] font-bold">Trang web</h3>
            <ul className="flex flex-col items-start gap-2 mt-4">
              <li>Trang chủ</li>
              <li>Cửa hàng</li>
              <li>Về chúng tôi</li>
              <li>Liên hệ với chúng tôi</li>
            </ul>
          </div>
          <ul className="flex flex-col items-start gap-2 mt-4 tablet:basis-[45%]">
            <li>Đánh sách riêng tư</li>
            <li>Hiệp ước cấp phép</li>
            <li>Câu hỏi thường gặp</li>
            <li>Điều khoản</li>
          </ul>
          <div className="items-start tablet:basis-[45%]">
            <h3 className="text-[18px] font-bold">Tài khoản của tôi</h3>
            <ul className="flex flex-col items-start gap-2 mt-4">
              <li>Tài khoản của tôi</li>
              <li>Lịch sử đơn hàng</li>
              <li>Danh sách ưa thích</li>
              <li>Thanh toán</li>
              <li>Giỏ hàng</li>
            </ul>
          </div>
        </div>
      </article>
      <div className="self-center">
        <ul className="flex items-center gap-4 md:gap-6 tablet:gap-6 mx-auto mt-4 ">
          <li className="p-3 rounded-[30%] border-[1px] border-white">
            <FiInstagram className="w-6 h-6" />
          </li>
          <li className="p-3 rounded-[30%] border-[1px] border-white">
            {" "}
            <BsGithub className="w-6 h-6" />
          </li>
          <li className="p-3 rounded-[30%] border-[1px] border-white">
            {" "}
            <FiTwitter className="w-6 h-6" />
          </li>
        </ul>
      </div>
    </footer>
  );
};
