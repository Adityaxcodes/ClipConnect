import { useEffect, useState } from "react";
import { gigService, type Gig } from "../../services/gig.service";
import GigCard from "../../components/common/GigCard";

const ClipperAllGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await gigService.getAllGigs();
        setGigs(data);
      } catch (error) {
        console.error("Failed to fetch gigs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-16">
        Loading gigs...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Browse Gigs
          </h1>
          <p className="text-gray-400">
            Find gigs that match your skills
          </p>
        </div>

        {/* Gigs */}
        {gigs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} variant="clipper" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No gigs available right now
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipperAllGigs;
