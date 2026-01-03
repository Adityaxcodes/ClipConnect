import {
  Plus,
  Eye,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  ChevronRight,
  Search,
  Activity,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"

const data = [
  { time: "12h ago", value: 400 },
  { time: "9h ago", value: 300 },
  { time: "6h ago", value: 350 },
  { time: "3h ago", value: 280 },
  { time: "Now", value: 320 },
]

const stats = [
  { title: "Total Gigs", value: "12", trend: "+2 this month", icon: Briefcase, color: "text-blue-500" },
  { title: "Active Gigs", value: "8", trend: "4 pending", icon: TrendingUp, color: "text-amber-500" },
  { title: "Applications", value: "45", trend: "+12 this week", icon: Users, color: "text-emerald-500" },
  { title: "Response Time", value: "2.4h", trend: "Average", icon: Clock, color: "text-purple-500" },
]

export default function CreatorDashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="size-5 md:size-6 bg-white rotate-45 rounded-sm" />
              <span className="text-sm md:text-base font-bold tracking-tight">DESIGNALI</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <span className="text-white">&gt;Observability</span>
              <span>Integrations</span>
              <span>Deployments</span>
              <span>Analytics</span>
              <span>Settings</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden border-white/10 bg-white/5 md:flex">
              Ship tickets &gt;
            </Button>
            <div className="size-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 md:p-6 lg:p-10">
        <div className="mx-auto w-full">
          <div className="mb-6 md:mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Creator Dashboard</h1>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
                Manage your gigs, track applications, and grow your creative business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <Button 
                className="bg-white font-semibold text-black hover:bg-white/90 w-full sm:w-auto text-sm md:text-base"
                onClick={() => navigate('/creator/gigs/new')}
              >
                <Plus className="mr-2 size-4" /> Create New Gig
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 bg-white/5 w-full sm:w-auto text-sm md:text-base"
                onClick={() => navigate('/creator/gigs')}
              >
                <Eye className="mr-2 size-4" /> View My Gigs
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar Controls */}
            <aside className="space-y-4 md:space-y-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-sm font-medium">
                  <BarChart3 className="size-4" /> Overview
                </div>
                <div className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-muted-foreground hover:bg-white/5 transition-colors">
                  <Activity className="size-4" /> Activity
                </div>
              </div>

              <div>
                <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Stats Overview
                </p>
                <div className="space-y-1">
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className={stat.color} />
                        <span className="text-muted-foreground">{stat.title}</span>
                      </div>
                      <span className="font-mono font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Real-time Requests Chart */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Edge Requests</CardTitle>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-4 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-blue-500" /> 2XX
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-amber-500" /> 4XX
                      </span>
                    </div>
                    <div className="h-[140px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="stepAfter"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Fast Data Transfer</CardTitle>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-4 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-blue-500" /> Outgoing
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-amber-500" /> Incoming
                      </span>
                    </div>
                    <div className="h-[140px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <Area
                            type="stepAfter"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="transparent"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Table */}
              <Card className="border-white/10 bg-white/5">
                <div className="border-b border-white/10 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="h-9 border-white/10 bg-transparent pl-9 text-xs focus-visible:ring-white/20"
                      placeholder="Search activity..."
                    />
                  </div>
                </div>
                <div className="divide-y divide-white/10">
                  {[
                    { title: "New application for Video Editor position", time: "2 hours ago", type: "application" },
                    {
                      title: "Your gig 'Motion Graphics Designer' was viewed 12 times",
                      time: "5 hours ago",
                      type: "view",
                    },
                    {
                      title: "Application deadline approaching for 'Content Writer'",
                      time: "1 day ago",
                      type: "deadline",
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02]">
                      <div className="flex items-center gap-4">
                        <div
                          className={`size-2 rounded-full ${activity.type === "application" ? "bg-emerald-500" : "bg-blue-500"}`}
                        />
                        <span className="text-sm font-medium">{activity.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Insights Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Zap className="size-4 text-amber-500" />
                      <span className="text-sm font-bold">Quick Tip</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Gigs with detailed descriptions and clear requirements receive 3x more quality applications.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Globe className="size-4 text-blue-500" />
                      <span className="text-sm font-bold">Pro Insight</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Respond to applications within 24 hours to increase your acceptance rate by 60%.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
