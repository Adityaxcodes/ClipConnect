import { apiClient } from "../utils/api";

/* ================= TYPES ================= */

export interface Gig {
  _id: string;
  title: string;
  description: string;
  pay: number;
  difficulty: string;
  status: string;
  creator: {
    _id: string;
    email: string;
  };
  createdAt: string;
  hasApplied?: boolean;
  image?: string;
}

export interface CreateGigData {
  title: string;
  description: string;
  pay: number;
  difficulty: string;
  requirements: string;
  image?: string;
  imagePublicId?: string;
}

export interface Application {
  _id: string;
  gig: string | Gig; // Can be either ID string or populated Gig object
  clipper: {
    _id: string;
    email: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WORKING" | "DONE";
  createdAt: string;
  submittedVideo?: string;
  submittedAt?: string;
  reviewNote?: string;
}

/* ================= SERVICE ================= */

export const gigService = {
  // Clipper: browse all open gigs
  getAllGigs(): Promise<Gig[]> {
    return apiClient.get("/api/gigs");
  },

  // Creator: get own gigs
  getCreatorGigs(): Promise<Gig[]> {
    return apiClient.get("/api/gigs/creator");
  },

  // Creator: create gig
  createGig(data: CreateGigData): Promise<Gig> {
    return apiClient.post("/api/gigs", data);
  },

  // Clipper: check if already applied to gig
  checkApplication(
    gigId: string,
  ): Promise<{ hasApplied: boolean; application: Application | null }> {
    return apiClient.get(`/api/applications/check/${gigId}`);
  },

  // Clipper: apply to gig
  applyToGig(gigId: string): Promise<Application> {
    return apiClient.post(`/api/applications/${gigId}`);
  },

  // Clipper: get my applied gigs
  getClipperGigs(): Promise<Application[]> {
    return apiClient.get("/api/applications/my");
  },

  // Creator: view applications for a gig
  getGigApplications(gigId: string): Promise<Application[]> {
    return apiClient.get(`/api/applications/gig/${gigId}`);
  },

  // Creator: update application status
  updateApplicationStatus(
    applicationId: string,
    status: Application["status"],
  ): Promise<Application> {
    return apiClient.patch(`/api/applications/${applicationId}`, { status });
  },

  // Clipper: get application detail
  getApplicationDetail(applicationId: string): Promise<Application> {
    return apiClient.get(`/api/applications/${applicationId}`);
  },

  // Clipper: submit video for application (with Cloudinary URL)
  submitVideo(applicationId: string, videoUrl: string, videoPublicId?: string): Promise<Application> {
    return apiClient.post(`/api/applications/${applicationId}/submit`, {
      videoUrl,
      videoPublicId,
    });
  },
};
