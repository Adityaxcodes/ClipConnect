import { useNavigate } from "react-router-dom";

const ClipperDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      
      {/* Header */}
      <header className="px-8 pt-8 mb-8 max-w-full">
        <h1 className="text-2xl font-semibold text-gray-800">
          Clipper Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Track your gigs and discover new work
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 px-8 max-w-full">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Applied Gigs</p>
          <p className="text-2xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Gigs</p>
          <p className="text-2xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed Gigs</p>
          <p className="text-2xl font-bold text-gray-800">0</p>
        </div>
      </section>

      {/* Main Actions */}
      <section className="bg-white rounded-lg p-6 shadow-sm mx-8 mb-8 max-w-full">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/clipper/gigs")}
            className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800"
          >
            Browse Gigs
          </button>

          <button
            onClick={() => navigate("/clipper/my-gigs")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            My Gigs
          </button>
        </div>
      </section>

    </div>
  );
};

export default ClipperDashboard;
