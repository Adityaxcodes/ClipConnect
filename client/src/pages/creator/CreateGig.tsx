import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Upload, LinkIcon, X, ImageIcon, CheckCircle2 } from "lucide-react"
import { gigService } from "@/services/gig.service"

export default function CreateGig() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    pay: "",
    difficulty: "Medium",
    requirements: "",
    link: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setError("")
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFileName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.title || !form.description || !form.pay || !form.requirements) {
      setError("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      let imageUrl = ""
      let imagePublicId = ""

      // Upload image to Cloudinary if one was selected
      if (imagePreview) {
        try {
          const token = localStorage.getItem("token")
          
          // Convert base64 to blob
          const base64Response = await fetch(imagePreview)
          const blob = await base64Response.blob()
          
          // Create FormData
          const formData = new FormData()
          formData.append("image", blob, fileName)

          // Upload to Cloudinary
          const uploadResponse = await fetch("http://localhost:5000/api/upload/image", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image")
          }

          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.data.url
          imagePublicId = uploadData.data.publicId
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
          setError("Failed to upload image. Creating gig without image.")
        }
      }

      // Create gig with or without image
      await gigService.createGig({
        title: form.title,
        description: form.description,
        pay: Number(form.pay),
        difficulty: form.difficulty,
        requirements: form.requirements,
        image: imageUrl,
        imagePublicId: imagePublicId,
      })

      navigate("/creator/gigs")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || err.message || "Failed to create gig")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-[98vw] bg-linear-to-br from-emerald-950 via-slate-950 to-teal-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex justify-center items-center px-4 py-12">
        <Card className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-sm border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">Create New Gig</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 text-balance">Post Your Next Project</h1>
              <p className="text-slate-400 text-lg">Share your gig with talented clippers and find the perfect match</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="image" className="text-slate-200 text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  Gig Image (Optional)
                </Label>

                {!imagePreview ? (
                  <div className="relative group">
                    <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-500/30 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer group-hover:scale-[1.02] duration-200"
                    >
                      <Upload className="w-12 h-12 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-slate-300 font-medium mb-1">Click to upload image</p>
                      <p className="text-slate-500 text-sm">PNG, JPG up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-emerald-500/30">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      onClick={removeImage}
                      size="icon"
                      variant="destructive"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{fileName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-slate-200 text-base font-semibold">
                  Gig Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Edit product demo video for SaaS launch"
                  value={form.title}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-200 text-base font-semibold">
                  Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your gig in detail... What kind of editing do you need? What's the project about?"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-base resize-none"
                  required
                />
              </div>

              {/* Pay and Difficulty Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="pay" className="text-slate-200 text-base font-semibold">
                    Payment (USD) <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-lg">
                      $
                    </span>
                    <Input
                      id="pay"
                      name="pay"
                      type="number"
                      placeholder="500"
                      value={form.pay}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base pl-8"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="difficulty" className="text-slate-200 text-base font-semibold">
                    Difficulty Level
                  </Label>
                  <Select value={form.difficulty} onValueChange={(value) => setForm({ ...form, difficulty: value })}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Link Input */}
              <div className="space-y-3">
                <Label htmlFor="link" className="text-slate-200 text-base font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-400" />
                  Reference Link (Optional)
                </Label>
                <Input
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://example.com/sample-video"
                  value={form.link}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base"
                />
                <p className="text-slate-500 text-sm">Share a link to samples, inspiration, or additional details</p>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <Label htmlFor="requirements" className="text-slate-200 text-base font-semibold">
                  Requirements <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="List any specific requirements, software, skills, or deliverables..."
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-base resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold h-12 text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Gig...
                  </span>
                ) : (
                  "Create Gig & Go Live"
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
