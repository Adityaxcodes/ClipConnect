import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { gigService } from "../../services/gig.service";
import GigCard from "../../components/common/GigCard";

const CreatorGigs = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        if (!isAuthenticated) return;

        const data = await gigService.getCreatorGigs();
        setGigs(data);
      } catch (error) {
        console.error("Failed to fetch creator gigs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-16">
        Loading your gigs...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Posted Gigs
          </h1>
          <p className="text-gray-400">
            Manage and track all gigs you've created
          </p>
        </div>

        {/* Gigs */}
        {gigs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                onClick={() => navigate(`/creator/gig/${gig._id}`)}
                className="cursor-pointer"
              >
                <GigCard gig={gig} variant="creator" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              You haven't posted any gigs yet
            </p>

            <button
              onClick={() => navigate("/creator/gigs/new")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Create Your First Gig
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorGigs;
