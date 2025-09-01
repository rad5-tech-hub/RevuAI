const DashboardStatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

export default DashboardStatCard;