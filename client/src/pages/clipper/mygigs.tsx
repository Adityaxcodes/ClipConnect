import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { gigService, type Application, type Gig } from "@/services/gig.service"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, User, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClipperMyGigs() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const data = await gigService.getClipperGigs()
        setApplications(data)
      } catch (error) {
        console.error("Failed to fetch clipper gigs", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyGigs()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10"
      case "accepted":
        return "text-blue-500 bg-blue-500/10"
      case "working":
        return "text-purple-500 bg-purple-500/10"
      case "done":
        return "text-green-500 bg-green-500/10"
      case "rejected":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const filteredApplications = applications
    .filter((app) => {
      const gig = app.gig as Gig
      const matchesSearch = gig?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "pay-high") {
        const gigA = a.gig as Gig
        const gigB = b.gig as Gig
        return (gigB?.pay || 0) - (gigA?.pay || 0)
      }
      if (sortBy === "pay-low") {
        const gigA = a.gig as Gig
        const gigB = b.gig as Gig
        return (gigA?.pay || 0) - (gigB?.pay || 0)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your gigs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">My Applications</h1>
              <p className="text-muted-foreground mt-1">Track all the gigs you've applied to</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredApplications.length} {filteredApplications.length === 1 ? "application" : "applications"}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      {applications.length > 0 && (
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="pay-high">Pay: High to Low</SelectItem>
                  <SelectItem value="pay-low">Pay: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <main className="container mx-auto px-4 py-8">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {applications.length === 0 ? "No applications yet" : "No applications found"}
            </h3>
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "Start browsing gigs and apply to get started"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((app) => {
              const gig = app.gig as Gig
              return (
                <Card key={app._id} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-bold text-xl text-foreground">{gig?.title || "Loading..."}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium text-green-600">${gig?.pay || "N/A"}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="text-foreground">{gig?.creator?.email || "Unknown"}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {formatDate(app.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => navigate(`/clipper/application/${app._id}`)}
                        className="whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
