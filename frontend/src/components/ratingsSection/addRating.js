import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const AddRating = ({ productId, onRatingAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { userData } = useSelector((state) => state.userAuth);
  const { username, email } = userData;

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      toast("Please log in to submit a rating", {
        type: "warning",
        autoClose: 2000,
      });
      return;
    }

    if (rating === 0) {
      toast("Please select a rating", {
        type: "warning",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";
      await axios.post(`${serverUrl}api/v1/products/addRating/${productId}`, {
        username,
        email,
        rating,
        comment,
      });

      toast("Rating submitted successfully!", {
        type: "success",
        autoClose: 2000,
      });

      setRating(0);
      setComment("");
      onRatingAdded();
    } catch (error) {
      toast(error.response?.data?.message || "Failed to submit rating", {
        type: "error",
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!username || !email) {
    return (
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800">Hãy đăng nhập để có thể đánh giá sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="font-bold text-[20px] tracking-[0.5px] mb-6">Đánh giá sản phẩm</h3>

      <form onSubmit={handleSubmitRating}>
        {/* Star Rating */}
        <div className="mb-6">
          <label className="font-semibold block mb-3">Đánh giá của bạn</label>
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <FaStar
                  className={`w-8 h-8 ${
                    i < (hoveredRating || rating)
                      ? "fill-yellow-400"
                      : "fill-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="font-semibold block mb-3">Nhận xét của bạn (Tùy chọn)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
            maxLength="500"
            rows="4"
            className="w-full p-3 border-[1px] border-gray-300 rounded focus:outline-none focus:border-secondaryColor resize-none"
          />
          <div className="text-sm text-gray-500 mt-1">{comment.length}/500</div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primaryColor text-white font-semibold py-3 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? "Submitting..." : "Gửi Đánh giá"}
        </button>
      </form>
    </div>
  );
};
