import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

export const RatingsDisplay = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";
        const response = await axios.get(`${serverUrl}api/v1/products/getRatings/${productId}`);
        
        setRatings(response.data.ratings);
        setAverageRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-yellow-400" : "fill-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-6">đang tải đánh giá...</div>;
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-[20px] tracking-[0.5px] mb-4">Đánh giá và Nhận xét của Khách hàng</h3>
      
      {/* Average Rating Section */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[32px] font-bold">{averageRating}</div>
            <div className="flex gap-1 justify-center">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-gray-600 mt-2">({totalRatings} các đánh giá)</div>
          </div>
        </div>
      </div>

      {/* Individual Ratings */}
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <div key={index} className="p-4 bg-white rounded border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{rating.username}</p>
                  <div className="flex gap-1 mt-1">{renderStars(rating.rating)}</div>
                </div>
                <span className="text-sm text-gray-500">
                  {rating.date ? new Date(rating.date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) : "N/A"}
                </span>
              </div>
              {rating.comment && <p className="text-gray-700 mt-2">{rating.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No ratings yet. Be the first to review!</p>
      )}
    </div>
  );
};
