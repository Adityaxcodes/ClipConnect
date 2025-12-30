import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { gigService } from "@/services/gig.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Gig {
  _id: string;
  title: string;
  description?: string;
  pay: number;
  difficulty: string;
  status?: string;
  creator?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt?: string;
  applicants?: number;
  image?: string;
}

interface GigCardProps {
  gig: Gig;
  variant?: "creator" | "clipper";
  onApply?: (gigId: string) => void;
  onClick?: () => void;
}

export function GigCard({
  gig,
  variant = "clipper",
  onApply,
  onClick,
}: GigCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if clipper has already applied
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (variant !== "clipper") return;

      try {
        const { hasApplied: alreadyApplied } =
          await gigService.checkApplication(gig._id);
        setHasApplied(alreadyApplied);
      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };

    checkApplicationStatus();
  }, [gig._id, variant]);

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant !== "clipper" || hasApplied) return;

    setIsApplying(true);
    setError("");

    try {
      await gigService.applyToGig(gig._id);
      setHasApplied(true);
      onApply?.(gig._id);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply";

      if (errorMessage.includes("Already applied")) {
        setHasApplied(true);
        setError("");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "easy":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800";
      case "intermediate":
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800";
      case "advanced":
      case "hard":
        return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
          >
            Closed
          </Badge>
        );
      case "in progress":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          >
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const getCreatorInitials = () => {
    if (!gig.creator) return "?";
    const firstName = gig.creator.firstName || "";
    const lastName = gig.creator.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return gig.creator.email?.[0]?.toUpperCase() || "?";
  };

  const creatorName = gig.creator
    ? `${gig.creator.firstName || ""} ${gig.creator.lastName || ""}`.trim() ||
      (gig.creator.email ? gig.creator.email.split("@")[0] : "Unknown")
    : "Unknown Creator";

  return (
    <Card
      className="group overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 cursor-pointer bg-card relative flex flex-col h-full"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {gig.image ? (
          <img
            src={gig.image}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary/20 mb-2">
                {gig.title.charAt(0).toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground">No preview</p>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </button>

        {/* Status Badge (for creators) */}
        {variant === "creator" && gig.status && (
          <div className="absolute top-3 left-3 z-10">
            {getStatusBadge(gig.status)}
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Creator Info */}
        {variant === "clipper" && gig.creator && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={gig.creator.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getCreatorInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate">
              {creatorName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors min-h-[2.5rem]">
          {gig.title}
        </h3>

        {/* Description */}
        {gig.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {gig.description}
          </p>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Difficulty & Time Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={`text-xs font-medium border ${getDifficultyColor(gig.difficulty)}`}
          >
            {gig.difficulty}
          </Badge>
          {gig.createdAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(gig.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Applicants Count (for creators) */}
        {variant === "creator" && gig.applicants !== undefined && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {gig.applicants}
              </span>{" "}
              {gig.applicants === 1 ? "applicant" : "applicants"}
            </span>
          </div>
        )}

        {/* Footer with Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Pay
              </span>
              <span className="text-lg font-bold text-foreground">
                ${gig.pay}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {variant === "clipper" && (
            <Button
              onClick={handleApply}
              disabled={isApplying || hasApplied}
              size="sm"
              variant={hasApplied ? "outline" : "default"}
              className={`min-w-[100px] transition-all duration-200 ${
                isHovered && !hasApplied && !isApplying
                  ? "shadow-lg scale-105"
                  : ""
              }`}
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Applying...
                </>
              ) : hasApplied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Applied
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          )}

          {variant === "creator" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              size="sm"
              variant="outline"
              className="min-w-[100px]"
            >
              View Details
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-destructive mt-2 text-center">{error}</p>
        )}
      </CardContent>

      {/* Hover Overlay Effect */}
      <div
        className={`absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </Card>
  );
}
