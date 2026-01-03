import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { gigService } from "@/services/gig.service"
import { GigCard, type Gig } from "@/components/gig-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreatorGigs() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        if (!isAuthenticated) return

        const data = await gigService.getCreatorGigs()
        setGigs(data)
      } catch (error) {
        console.error("Failed to fetch creator gigs", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGigs()
  }, [isAuthenticated])

  const filteredGigs = gigs
    .filter((gig) => {
      const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || gig.status?.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
      if (sortBy === "pay-high") {
        return b.pay - a.pay
      }
      if (sortBy === "pay-low") {
        return a.pay - b.pay
      }
      if (sortBy === "applicants") {
        return (b.applicants || 0) - (a.applicants || 0)
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
        <div className="w-full mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">My Posted Gigs</h1>
              <p className="text-muted-foreground mt-1">Manage and track all gigs you've created</p>
            </div>
            <Button onClick={() => navigate("/creator/gigs/new")} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Gig
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      {gigs.length > 0 && (
        <div className="border-b border-border bg-card/50">
          <div className="w-full mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search gigs..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="applicants">Most Applicants</SelectItem>
                  <SelectItem value="pay-high">Pay: High to Low</SelectItem>
                  <SelectItem value="pay-low">Pay: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Gigs Grid */}
      <main className="w-full mx-auto px-4 py-8">
        {filteredGigs.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {gigs.length === 0 ? "No gigs posted yet" : "No gigs found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {gigs.length === 0
                ? "Create your first gig to start finding talented clippers"
                : "Try adjusting your search or filters"}
            </p>
            {gigs.length === 0 && (
              <Button onClick={() => navigate("/creator/gigs/new")} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Gig
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <GigCard
                key={gig._id}
                gig={gig}
                variant="creator"
                onClick={() => navigate(`/creator/gig/${gig._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
