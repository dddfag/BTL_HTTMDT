import React from "react";
import { FaTruck } from "react-icons/fa";
import { AiOutlineSafety } from "react-icons/ai";
import { BiUserVoice } from "react-icons/bi";
import { TbDiscount2 } from "react-icons/tb";

export const WhyChooseUsSection = () => {
  return (
    <div className="pt-20 pb-16 mb-20 bg-neutralColor w-[100%]">
      <h2 className="text-[40px] text-center  font-bold ">Tại sao chọn chúng tôi</h2>
      <div className="flex items-start w-[18.5em] max-w-[92%] mx-auto gap-12  mt-10 flex-col tablet:w-[70%] md:flex-row md:w-[80%] md:flex-wrap md:justify-between">
        <div className="flex w-[100%] md:basis-[45%]  items-start gap-4 tablet:gap-6 tablet:w-[90%] tablet:max-w-[384px]">
          <div className="bg-primaryColor  p-8 rounded-[50%] mx-auto">
            <FaTruck className="fill-secondaryColor w-9 h-9 md:w-12 md:h-12 tablet:w-12 tablet:h-12 " />
          </div>
          <div className="flex flex-col  gap-4">
            <h4 className="text-[24px]  text-center font-bold font-RobotoCondensed">Vận chuyển chi phí thấp</h4>
            <p className="text-center leading-[140%] text-to-be-wrapped">
              Chúng tôi cung cấp chi phí thấp khi vận chuyển cho tất cả các đơn đặt hàng, vì vậy bạn có thể mua sắm với sự tự tin về quyền lợi của mình."
            </p>
          </div>
        </div>
        <div className="flex w-[100%] md:basis-[45%] flex-row items-start gap-4  tablet:gap-6 tablet:w-[90%] tablet:max-w-[384px]">
          <div className="bg-primaryColor  p-8 rounded-[50%] mx-auto">
            <BiUserVoice className="fill-secondaryColor w-9 h-9 md:w-12 md:h-12 tablet:w-12 tablet:h-12  " />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[24px]  text-center font-bold  font-RobotoCondensed">Dịch vụ khách hàng</h4>
            <span className="text-center leading-[140%] text-to-be-wrapped">
              Đội ngành dịch vụ khách hàng của chúng tôi có sẵn giúp bạn với bất kỳ vấn đề hoặc thắc mắc. 
            </span>
          </div>
        </div>
        <div className="flex w-[100%] md:basis-[45%] flex-row items-start gap-4 tablet:gap-6 tablet:w-[90%] tablet:max-w-[384px]">
          <div className="bg-primaryColor  p-8 rounded-[50%] mx-auto">
            <TbDiscount2 className="fill-secondaryColor w-9 h-9 md:w-12 md:h-12 tablet:w-12 tablet:h-12  " />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[24px]  text-center font-bold font-RobotoCondensed">Các ưu đãi và chiết khấu đặc biệt</h4>
            <span className="text-center leading-[140%] text-to-be-wrapped">
              Chúng tôi liên tục cập nhật kho hàng với các ưu đãi đặc biệt và sản phẩm mà bạn sẽ không tìm thấy nơi nào khác. Từ các mẫu hàng giới hạn đến các mặt hàng có một không hai.
            </span>
          </div>
        </div>
        <div className="flex w-[100%] md:basis-[45%]  items-start gap-4 tablet:gap-6 tablet:w-[90%] tablet:max-w-[384px]">
          <div className="bg-primaryColor  p-8 rounded-[50%] mx-auto">
            <AiOutlineSafety className="fill-secondaryColor w-9 h-9 md:w-12 md:h-12 tablet:w-12 tablet:h-12  " />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[24px]  text-center font-bold font-RobotoCondensed">Thanh toán an toàn và bảo mật</h4>
            <span className="text-center leading-[140%] text-to-be-wrapped">
              Chúng tôi cung cấp một các tùy chọn thanh toán an toàn, do đó bạn có thể mua sắm với sự tự tin rằng thông tin của bạn được bảo vệ ở từng bước."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
