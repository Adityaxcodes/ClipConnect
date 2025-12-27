import { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
import { gigService, type Application } from "../../services/gig.service";

const ClipperMyGigs = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const data = await gigService.getClipperGigs();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch clipper gigs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGigs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "accepted":
        return "primary";
      case "working":
        return "secondary";
      case "done":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-16">
        Loading your gigs...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6 py-8">
      <div className="max-w-[100vw] mx-auto">

        <h1 className="text-4xl font-bold text-white mb-6">
          My Gigs
        </h1>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] border border-gray-800 rounded-xl">
            <p className="text-gray-400 text-lg">
              You haven’t applied to any gigs yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] border border-gray-800/50 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {typeof app.gig === 'string' ? 'Loading...' : app.gig.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Pay: ${typeof app.gig === 'string' ? 'N/A' : app.gig.pay}
                    </p>
                  </div>

                  <Chip
                    color={getStatusColor(app.status)}
                    size="sm"
                    variant="flat"
                  >
                    {app.status}
                  </Chip>
                </div>

                <p className="text-gray-400 text-sm mt-2">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipperMyGigs;
