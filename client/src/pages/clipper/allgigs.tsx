import { useEffect, useState } from "react";
import { gigService, type Gig } from "@/services/gig.service";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, AlertCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AllGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [appliedGigs, setAppliedGigs] = useState<Record<string, boolean>>({});
  const [applyingGigs, setApplyingGigs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await gigService.getAllGigs();
        setGigs(data);

        // Initialize quantities to 1 for each gig
        const initialQuantities: Record<string, number> = {};
        data.forEach((gig) => {
          initialQuantities[gig._id] = 1;
        });
        setQuantities(initialQuantities);

        // Check applied status for each gig
        const appliedStatus: Record<string, boolean> = {};
        await Promise.all(
          data.map(async (gig) => {
            try {
              const { hasApplied } = await gigService.checkApplication(gig._id);
              appliedStatus[gig._id] = hasApplied;
            } catch (err) {
              appliedStatus[gig._id] = false;
            }
          }),
        );
        setAppliedGigs(appliedStatus);
      } catch (err) {
        console.error(err);
        setError("Failed to load gigs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const handleApply = async (gigId: string) => {
    if (appliedGigs[gigId]) return;

    setApplyingGigs((prev) => ({ ...prev, [gigId]: true }));

    try {
      await gigService.applyToGig(gigId);
      setAppliedGigs((prev) => ({ ...prev, [gigId]: true }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply";
      console.error(errorMessage);
    } finally {
      setApplyingGigs((prev) => ({ ...prev, [gigId]: false }));
    }
  };

  const incrementQuantity = (gigId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [gigId]: Math.min((prev[gigId] || 1) + 1, 10),
    }));
  };

  const decrementQuantity = (gigId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [gigId]: Math.max((prev[gigId] || 1) - 1, 1),
    }));
  };

  const filteredGigs = gigs
    .filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || gig.status?.toLowerCase() === statusFilter;
      const matchesDifficulty =
        difficultyFilter === "all" ||
        gig.difficulty.toLowerCase() === difficultyFilter;
      return matchesSearch && matchesStatus && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      if (sortBy === "pay-high") {
        return b.pay - a.pay;
      }
      if (sortBy === "pay-low") {
        return a.pay - b.pay;
      }
      return 0;
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-50 text-green-700 border-green-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "hard":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading available gigs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg font-semibold mb-2">
            Error Loading Gigs
          </p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Available Gigs
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search gigs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full sm:w-[160px] bg-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="pay-high">Highest Pay</SelectItem>
                <SelectItem value="pay-low">Lowest Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table Header */}
        <div className="bg-white rounded-t-lg border border-gray-200 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-6">Gig</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-4 text-right">Action</div>
          </div>
        </div>

        {/* Gigs List */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg divide-y divide-gray-200">
          {filteredGigs.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                {gigs.length === 0
                  ? "No gigs available right now"
                  : "No gigs match your filters"}
              </p>
              <p className="text-gray-400 text-sm">
                {gigs.length === 0
                  ? "Check back later for new opportunities"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredGigs.map((gig) => (
              <div
                key={gig._id}
                className="grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors"
              >
                {/* Gig Info - Left Side */}
                <div className="col-span-12 sm:col-span-6 flex gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    {gig.image ? (
                      <img
                        src={gig.image}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.classList.add(
                              "flex",
                              "items-center",
                              "justify-center",
                            );
                            target.parentElement.innerHTML = `
                              <div class="text-center">
                                <div class="text-3xl font-bold text-gray-400 mb-1">
                                  ${gig.title.charAt(0).toUpperCase()}
                                </div>
                                <div class="text-xs text-gray-400">No image</div>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-400 mb-1">
                            {gig.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">No image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg line-clamp-1">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {gig.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 ${getDifficultyColor(
                          gig.difficulty,
                        )}`}
                      >
                        {gig.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {gig.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Price - Center */}
                <div className="col-span-6 sm:col-span-2 flex items-center justify-center sm:justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      £{gig.pay.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action - Right Side */}
                <div className="col-span-6 sm:col-span-4 flex items-center justify-end gap-3">
                  {!appliedGigs[gig._id] ? (
                    <>
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-amber-700 rounded-full overflow-hidden">
                        <button
                          onClick={() => decrementQuantity(gig._id)}
                          className="p-2 hover:bg-amber-800 transition-colors"
                          disabled={quantities[gig._id] <= 1}
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        <span className="px-4 text-white font-medium min-w-[3rem] text-center">
                          {quantities[gig._id] || 1}
                        </span>
                        <button
                          onClick={() => incrementQuantity(gig._id)}
                          className="p-2 hover:bg-amber-800 transition-colors"
                          disabled={quantities[gig._id] >= 10}
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* Apply Button */}
                      <Button
                        onClick={() => handleApply(gig._id)}
                        disabled={applyingGigs[gig._id]}
                        className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-full font-medium transition-colors"
                      >
                        {applyingGigs[gig._id] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Apply to gig
                          </span>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled
                      className="bg-green-100 text-green-700 hover:bg-green-100 px-6 py-2 rounded-full font-medium cursor-not-allowed"
                    >
                      ✓ Applied
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Count */}
        {filteredGigs.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredGigs.length} of {gigs.length} gigs
          </div>
        )}
      </div>

      {/* Checkout Button (if any gigs applied) */}
      {Object.values(appliedGigs).some((applied) => applied) && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-2xl transition-all hover:scale-105">
            Proceed to Checkout →
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllGigs;
