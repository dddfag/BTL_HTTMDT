import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import FooterSection from "../components/footerSection";
import { WhyChooseUsSection } from "./homepage/whyChooseUsSection";
import FurnitureVector from "../assets/Home-furniture-set.jpg";

export const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mt-12 w-[100%] h-auto bg-neutralColor text-secondaryColor tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] py-6 flex items-center justify-between font-bold  font-RobotoCondensed lg:col-span-full lg:row-span-1">
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
          <span className=" capitalize">Về chúng tôi</span>
        </div>
      </div>
      <section className="w-full  mt-4 tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] flex flex-col md:flex-row gap-4  pt-20 pb-10">
        <div>
          <h2 className="text-[28px] md:text-[32px] lg:text-[36px] mb-2">Câu chuyện của chúng tôi</h2>
          <p className="leading-[180%] first-letter:float-left first-letter:mr-4 first-letter:text-7xl  first-letter:text-secondaryColor first-letter:font-bold">
            Chào mừng đến cửa hàng nội thất trực tuyến của chúng tôi - Auffur, nơi chúng tôi cung cấp một lựa chọn rộng rãi nội thất chất lượng cao, gá cả phải chăn cho mọ̣ phòng trong nhà. Nền tảng trực tuyến của chúng tôi cho phép bạn mua sắm nội thất kẳ đời nó, với các bộ lọc dễ sử dụng giúp bạn tìm thấy mảnh ghép hoàn hảo cho phong cách và ngăn sách của bạn. Chúng tôi tin rằng mọi người đều xứng đáng có một ngôi nhà đẹp và thoải mái, và chúng tôi cam kết làm cho điều đó trở thành hiện thực cho khách hàng của chúng tôi. Nội thất của chúng tôi được thiết kế và chế tạo bởi các chún gia chệ dùng những thành phần tốt nhất, đảm bảo rằng bạn nhận được nội thất vởa sang trọng vừa bền. Tại Auffur, chúng tôi đam mê tạo ra các không gian đẹp và cung cấp dịch vụ khách hàng xuất sắc, và chúng tôi hé mong giúp bạn xây dựng ngôi nhà mơ ước của bạn.
          </p>
        </div>
        <div className=" flex justify-center items-center">
          <img className="" src={FurnitureVector} alt="" />
        </div>
      </section>
      <WhyChooseUsSection />
      <FooterSection />
    </>
  );
};
