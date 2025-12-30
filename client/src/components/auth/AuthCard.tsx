"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Mail, Eye, EyeOff } from "lucide-react"

interface AuthCardProps {
  isLoading: boolean
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  firstName?: string
  setFirstName?: (name: string) => void
  lastName?: string
  setLastName?: (name: string) => void
  role?: "CREATOR" | "CLIPPER"
  setRole?: (role: "CREATOR" | "CLIPPER") => void
  rememberMe: boolean
  setRememberMe: (remember: boolean) => void
  onSignIn: (e: React.FormEvent) => void
  onSignUp: (e: React.FormEvent) => void
  onSocialLogin?: (provider: string) => void
  onForgotPassword?: () => void
  onClose?: () => void
}

export function AuthCard({
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  firstName: externalFirstName,
  setFirstName: externalSetFirstName,
  lastName: externalLastName,
  setLastName: externalSetLastName,
  role: externalRole,
  setRole: externalSetRole,
  rememberMe,
  setRememberMe,
  onSignIn,
  onSignUp,
  onSocialLogin = () => {},
  onForgotPassword = () => {},
  onClose,
}: AuthCardProps) {
  const [activeTab, setActiveTab] = useState("signup")
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [internalFirstName, setInternalFirstName] = useState("")
  const [internalLastName, setInternalLastName] = useState("")
  const [internalRole, setInternalRole] = useState<"CREATOR" | "CLIPPER">("CREATOR")

  const firstName = externalFirstName ?? internalFirstName
  const setFirstName = externalSetFirstName ?? setInternalFirstName
  const lastName = externalLastName ?? internalLastName
  const setLastName = externalSetLastName ?? setInternalLastName
  const role = externalRole ?? internalRole
  const setRole = externalSetRole ?? setInternalRole

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border-2 border-white/20 rounded-4xl p-6 shadow-2xl transform transition-all duration-300 max-h-[97vh] overflow-y-auto">
        {/* Header with tabs and close button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("signup")}
              className={`font-body text-button px-4 py-1.5 rounded-full transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setActiveTab("signin")}
              className={`font-body text-button px-4 py-1.5 rounded-full transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Sign in
            </button>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-200"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          )}
        </div>

        <h1 className="font-heading text-section-title text-white mb-6 transition-all duration-300">
          {activeTab === "signup" ? "Create an account" : "Welcome back"}
        </h1>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signup" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            {/* Sign Up Form */}
            <form onSubmit={onSignUp} className="space-y-3">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Role selection field */}
              <div className="space-y-2">
                <label className="font-body text-sm text-white/80">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("CREATOR")}
                    className={`font-body text-button py-2.5 rounded-xl transition-all duration-300 ${
                      role === "CREATOR"
                        ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg"
                        : "bg-black/20 backdrop-blur-sm text-white/60 border border-white/10 hover:bg-black/30 hover:text-white"
                    }`}
                  >
                    Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("CLIPPER")}
                    className={`font-body text-button py-2.5 rounded-xl transition-all duration-300 ${
                      role === "CLIPPER"
                        ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg"
                        : "bg-black/20 backdrop-blur-sm text-white/60 border border-white/10 hover:bg-black/30 hover:text-white"
                    }`}
                  >
                    Clipper
                  </button>
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 transition-colors duration-200" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-10 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <Input
                  type={showSignupPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-10 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Create account button */}
              <Button
                type="submit"
                className="font-body text-button w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white rounded-xl h-11 mt-4 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create an account"}
              </Button>
            </form>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signin" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            <form onSubmit={onSignIn} className="space-y-3">
              {/* Role selection field */}
              <div className="space-y-2">
                <label className="font-body text-sm text-white/80">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("CREATOR")}
                    className={`font-body text-button py-2.5 rounded-xl transition-all duration-300 ${
                      role === "CREATOR"
                        ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg"
                        : "bg-black/20 backdrop-blur-sm text-white/60 border border-white/10 hover:bg-black/30 hover:text-white"
                    }`}
                  >
                    Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("CLIPPER")}
                    className={`font-body text-button py-2.5 rounded-xl transition-all duration-300 ${
                      role === "CLIPPER"
                        ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg"
                        : "bg-black/20 backdrop-blur-sm text-white/60 border border-white/10 hover:bg-black/30 hover:text-white"
                    }`}
                  >
                    Clipper
                  </button>
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 transition-colors duration-200" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-10 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-11 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-10 text-sm transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border border-white/20 bg-black/20 text-white focus:ring-white/20 focus:ring-2"
                  />
                  <span className="font-body text-muted text-white/60">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-body text-muted text-white/60 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="font-body text-button w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white rounded-xl h-11 mt-4 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="font-body text-muted px-4 text-white/40">
            {activeTab === "signup" ? "OR SIGN UP WITH" : "OR SIGN IN WITH"}
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSocialLogin("Google")}
            className="font-body text-button bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-10 flex items-center justify-center gap-2 hover:bg-black/30 transition-all duration-300"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-linear-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full"></div>
            </div>
            <span className="text-white">Google</span>
          </button>
          <button
            onClick={() => onSocialLogin("Apple")}
            className="font-body text-button bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl h-10 flex items-center justify-center gap-2 hover:bg-black/30 transition-all duration-300"
          >
            <div className="w-4 h-4 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
            <span className="text-white">Apple</span>
          </button>
        </div>

        <p className="font-body text-muted text-center text-white/40 mt-5">
          {activeTab === "signup"
            ? "By creating an account, you agree to our Terms & Service"
            : "By signing in, you agree to our Terms & Service"}
        </p>
      </div>
    </div>
  )
}
