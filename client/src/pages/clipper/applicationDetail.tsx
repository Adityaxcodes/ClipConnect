import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { gigService, type Application, type Gig } from "@/services/gig.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Upload, 
  Video, 
  CheckCircle2, 
  X, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  FileText,
  Clock
} from "lucide-react"

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        const data = await gigService.getApplicationDetail(id!)
        setApplication(data)
        
        // If video already submitted, set preview
        if (data.submittedVideo) {
          setVideoPreview(data.submittedVideo)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch application details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchApplication()
    }

    // Cleanup blob URL on unmount
    return () => {
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [id])

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError("")
    setSuccess("")

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file")
      return
    }

    // Validate file size (50MB max for better upload performance)
    // Note: Base64 encoding increases size by ~33%
    if (file.size > 50 * 1024 * 1024) {
      setError("Video size should be less than 50MB. Please compress or trim your video.")
      return
    }

    // Warn if file is large
    if (file.size > 20 * 1024 * 1024) {
      console.warn("Large video file detected:", (file.size / 1024 / 1024).toFixed(2), "MB")
    }

    setVideoFile(file)

    // Create preview URL - don't revoke it yet
    const videoUrl = URL.createObjectURL(file)
    
    // Check video duration
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      const duration = video.duration
      setVideoDuration(duration)
      
      if (duration > 60) {
        setError("Video must be 60 seconds or less")
        setVideoFile(null)
        setVideoPreview(null)
        URL.revokeObjectURL(videoUrl)
        return
      }
      
      if (duration < 1) {
        setError("Video is too short")
        setVideoFile(null)
        setVideoPreview(null)
        URL.revokeObjectURL(videoUrl)
        return
      }
      
      // Only set preview if validation passes
      setVideoPreview(videoUrl)
    }
    
    video.onerror = () => {
      setError("Failed to load video file")
      setVideoFile(null)
      URL.revokeObjectURL(videoUrl)
    }
    
    video.src = videoUrl
  }

  const removeVideo = () => {
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoFile(null)
    setVideoPreview(null)
    setVideoDuration(0)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!videoFile) {
      setError("Please select a video to submit")
      return
    }

    if (!videoDuration || videoDuration > 60) {
      setError("Video must be between 1-60 seconds")
      return
    }

    if (videoDuration < 1) {
      setError("Video is too short")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      
      // Convert video to base64
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        try {
          const videoData = reader.result as string
          
          if (!videoData || typeof videoData !== 'string') {
            throw new Error("Invalid video data")
          }
          
          console.log("Submitting video, size:", (videoData.length / 1024 / 1024).toFixed(2), "MB")
          
          await gigService.submitVideo(id!, videoData)
          setSuccess("Video submitted successfully!")
          
          // Clean up blob URL
          if (videoPreview && videoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview)
          }
          
          // Refresh application data
          const updatedApp = await gigService.getApplicationDetail(id!)
          setApplication(updatedApp)
          setVideoFile(null)
          setVideoPreview(null)
          
          setTimeout(() => {
            navigate("/clipper/my-gigs")
          }, 2000)
        } catch (err: any) {
          console.error("Submit error:", err)
          setError(err.response?.data?.message || err.message || "Failed to submit video")
          setSubmitting(false)
        }
      }
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error)
        setError("Failed to read video file. Please try again.")
        setSubmitting(false)
      }
      
      reader.readAsDataURL(videoFile)
    } catch (err: any) {
      console.error("Submission error:", err)
      setError("Failed to process video. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
            <p className="text-muted-foreground mb-4">The application you're looking for doesn't exist</p>
            <Button onClick={() => navigate("/clipper/my-gigs")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Gigs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const gig = application.gig as Gig
  const canSubmit = application.status === "ACCEPTED" || application.status === "WORKING"
  const hasSubmitted = !!application.submittedVideo

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/clipper/my-gigs")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Applications
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Application Details</h1>
          <p className="text-muted-foreground mt-1">View gig details and submit your work</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {/* Gig Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{gig.title}</CardTitle>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                  application.status === "ACCEPTED" ? "bg-blue-500/10 text-blue-500" :
                  application.status === "WORKING" ? "bg-purple-500/10 text-purple-500" :
                  application.status === "DONE" ? "bg-green-500/10 text-green-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {application.status}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-semibold">${gig.pay}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-semibold">{gig.creator.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-semibold">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-semibold capitalize">{gig.difficulty}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{gig.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Video Submission Card */}
        {canSubmit && !hasSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                Submit Your Work
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload your completed video (0-60 seconds, max 50MB)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!videoPreview ? (
                <div className="relative group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-foreground font-medium mb-1">Click to upload video</p>
                    <p className="text-muted-foreground text-sm">MP4, MOV, AVI up to 50MB</p>
                    <p className="text-muted-foreground text-xs mt-2">Duration: 0-60 seconds</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group rounded-xl overflow-hidden border-2 border-border">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-96"
                    />
                    <Button
                      type="button"
                      onClick={removeVideo}
                      size="icon"
                      variant="destructive"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">{videoFile?.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {videoDuration.toFixed(1)}s
                        </span>
                        <span>{(videoFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || videoDuration > 60}
                    className="w-full"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Submit Video
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Already Submitted */}
        {hasSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                Video Submitted
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Submitted on {new Date(application.submittedAt!).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden border-2 border-border">
                <video
                  src={application.submittedVideo}
                  controls
                  className="w-full max-h-96"
                />
              </div>
              
              {application.reviewNote && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Creator's Review
                  </h4>
                  <p className="text-sm text-muted-foreground">{application.reviewNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cannot Submit Message */}
        {!canSubmit && !hasSubmitted && (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cannot Submit Yet</h3>
              <p className="text-muted-foreground">
                {application.status === "PENDING" 
                  ? "Wait for the creator to accept your application before submitting work"
                  : application.status === "REJECTED"
                  ? "This application was rejected by the creator"
                  : "This application is no longer active"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
