import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chip } from "@nextui-org/react";
import { gigService, type Application } from "../../services/gig.service";

const GigDetails = () => {
  const { id: gigId } = useParams<{ id: string }>();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gigId) return;

    const fetchApplications = async () => {
      try {
        const data = await gigService.getGigApplications(gigId);
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [gigId]);

  const updateStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED" | "WORKING" | "DONE"
  ) => {
    try {
      await gigService.updateApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getApplicantStatusColor = (status: string) => {
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
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-6">
          Gig Applications
        </h1>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] border border-gray-800 rounded-xl">
            <p className="text-gray-400 text-lg">
              No applicants yet for this gig
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] border border-gray-800/50 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Applicant Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {app.clipper.email}
                      </h3>
                      <Chip
                        color={getApplicantStatusColor(app.status)}
                        size="sm"
                        variant="flat"
                      >
                        {app.status}
                      </Chip>
                    </div>

                    <p className="text-gray-400 text-sm">
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {app.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(app._id, "ACCEPTED")
                          }
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(app._id, "REJECTED")
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <button
                        onClick={() =>
                          updateStatus(app._id, "WORKING")
                        }
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl"
                      >
                        Mark Working
                      </button>
                    )}

                    {app.status === "WORKING" && (
                      <button
                        onClick={() =>
                          updateStatus(app._id, "DONE")
                        }
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
                      >
                        Mark Done
                      </button>
                    )}

                    {app.status === "DONE" && (
                      <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl">
                        ✓ Completed
                      </span>
                    )}

                    {app.status === "REJECTED" && (
                      <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl">
                        ✗ Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;
