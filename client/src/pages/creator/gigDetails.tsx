import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gigService, type Application } from "../../services/gig.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Download, 
  Video, 
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";

const GigDetails = () => {
  const { id: gigId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      setUpdatingId(applicationId);
      await gigService.updateApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadVideo = (videoData: string, clipperEmail: string) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = videoData;
      link.download = `submission_${clipperEmail}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download video", error);
      alert("Failed to download video. Please try again.");
    }
  };

  const getApplicantStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "accepted":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "working":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "done":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/creator/gigs")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Gigs
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Gig Applications</h1>
          <p className="text-muted-foreground mt-1">Review and manage applications for this gig</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No applicants yet</h3>
              <p className="text-muted-foreground">Check back later for applications</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app._id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        {app.clipper.email}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        {app.submittedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Submitted {new Date(app.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getApplicantStatusColor(app.status)}`}>
                      {app.status}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  {/* Submitted Video Section */}
                  {app.submittedVideo && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Video className="w-5 h-5 text-blue-500" />
                          Submitted Work
                        </h4>
                        <Button
                          onClick={() => downloadVideo(app.submittedVideo!, app.clipper.email)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                      
                      <div className="rounded-xl overflow-hidden border-2 border-border bg-black">
                        <video
                          src={app.submittedVideo}
                          controls
                          className="w-full max-h-96"
                        />
                      </div>
                      
                      {app.reviewNote && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <h5 className="font-semibold mb-2 text-sm">Your Review Note:</h5>
                          <p className="text-sm text-muted-foreground">{app.reviewNote}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Video Yet */}
                  {!app.submittedVideo && app.status !== "PENDING" && app.status !== "REJECTED" && (
                    <div className="p-6 bg-muted/30 border border-dashed border-border rounded-xl text-center">
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {app.status === "ACCEPTED" ? "Waiting for clipper to submit their work" : "No submission yet"}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {app.status === "PENDING" && (
                      <>
                        <Button
                          onClick={() => updateStatus(app._id, "ACCEPTED")}
                          disabled={updatingId === app._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {updatingId === app._id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                          )}
                          Accept
                        </Button>
                        <Button
                          onClick={() => updateStatus(app._id, "REJECTED")}
                          disabled={updatingId === app._id}
                          variant="destructive"
                        >
                          {updatingId === app._id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <Button
                        onClick={() => updateStatus(app._id, "WORKING")}
                        disabled={updatingId === app._id}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {updatingId === app._id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 mr-2" />
                        )}
                        Mark as Working
                      </Button>
                    )}

                    {app.status === "WORKING" && app.submittedVideo && (
                      <Button
                        onClick={() => updateStatus(app._id, "DONE")}
                        disabled={updatingId === app._id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {updatingId === app._id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Mark as Done
                      </Button>
                    )}

                    {app.status === "DONE" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}

                    {app.status === "REJECTED" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">Rejected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GigDetails;
