import { Star } from "lucide-react";

const RatingDistribution = ({ data }) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Distribution</h3>
      <div className="space-y-4">
        {data?.length > 0 ? (
          data.map((item, index) => (
            <div key={`rating-dist-${item.rating}-${index}`} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-8">{item.rating}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item.percentage}%`, animation: `growWidth 1s ease-out ${index * 0.1}s both` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-10 text-right">{item.count}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h4>
            <p className="text-gray-500 text-sm max-w-xs">
              Once customers start leaving feedback, you'll see the rating distribution here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RatingDistribution;