import { Card, CardHeader, CardBody, CardFooter, Chip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gigService } from "../../services/gig.service";

interface GigCardProps {
  gig: {
    _id: string;
    title: string;
    description?: string;
    pay: number;
    difficulty: string;
    status?: string;
    creator?: {
      _id: string;
      email: string;
    };
    applicants?: number;
    createdAt?: string;
    image?: string;
  };
  variant?: "creator" | "clipper";
}

export default function GigCard({ gig, variant = "clipper" }: GigCardProps) {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState("");

  // Check if clipper has already applied to this gig
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (variant !== "clipper") return;

      setIsCheckingStatus(true);
      try {
        const { hasApplied: alreadyApplied } = await gigService.checkApplication(gig._id);
        setHasApplied(alreadyApplied);
      } catch (err) {
        console.error("Error checking application status:", err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkApplicationStatus();
  }, [gig._id, variant]);

  const handleApply = async () => {
    if (variant !== "clipper" || hasApplied) return;

    setIsApplying(true);
    setError("");

    try {
      await gigService.applyToGig(gig._id);
      setHasApplied(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to apply";
      
      // Handle 409 Conflict specifically
      if (errorMessage.includes("Already applied")) {
        setHasApplied(true);
        setError(""); // Clear error since this is expected behavior
      } else {
        setError(errorMessage);
      }
      
      console.error("Error applying to gig:", err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewApplications = () => {
    if (variant === "creator") {
      navigate(`/creator/gig/${gig._id}`);
    }
  };
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "success";
      case "closed":
        return "danger";
      case "in progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] border border-gray-800/50 hover:border-gray-700/70 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden">
      {gig.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={gig.image} 
            alt={gig.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2 pt-4 px-5 flex-col items-start gap-2">
        <div className="flex w-full justify-between items-start">
          <h4 className="font-bold text-xl text-white">{gig.title}</h4>
          {variant === "creator" && gig.status && (
            <Chip color={getStatusColor(gig.status)} size="sm" variant="flat">
              {gig.status}
            </Chip>
          )}
        </div>
        <div className="flex gap-2 mt-1">
          <Chip
            color={getDifficultyColor(gig.difficulty)}
            size="sm"
            variant="dot"
          >
            {gig.difficulty}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="py-3 px-5">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pay:</span>
            <span className="font-semibold text-green-400 text-lg">
              ${gig.pay}
            </span>
          </div>

          {variant === "clipper" && gig.creator && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Creator:</span>
              <span className="text-white font-medium">{gig.creator.email}</span>
            </div>
          )}

          {variant === "creator" && gig.applicants !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Applicants:</span>
              <span className="text-blue-400 font-medium">{gig.applicants}</span>
            </div>
          )}

          {gig.createdAt && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Posted:</span>
              <span className="text-gray-300 text-xs">
                {new Date(gig.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-2 pb-4 px-5">
        {error && (
          <p className="text-red-400 text-xs mb-2 w-full text-center">{error}</p>
        )}
        {variant === "clipper" && (
          <button
            onClick={handleApply}
            disabled={isApplying || hasApplied}
            className={`w-full font-semibold py-2.5 rounded-xl transition-all duration-200
              ${
                hasApplied
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              }
            `}
          >
            {hasApplied
              ? "Already Applied"
              : isApplying
              ? "Applying..."
              : "Apply Now"}
          </button>
        )}
        {variant === "creator" && (
          <button
            onClick={handleViewApplications}
            className="w-full font-semibold py-2.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            View Applications
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
