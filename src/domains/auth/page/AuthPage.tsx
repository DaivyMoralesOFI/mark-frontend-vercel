// authPage.tsx
//
// This file defines the AuthPage component, which renders the login/signup forms with a modern card UI.
// It handles authentication state, toggles between login and signup views, and integrates with Firebase auth services.

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../services/authService"
import { useAuth } from "../hooks/useAuth"

/**
 * AuthPage
 *
 * Renders the authentication page with Login and Sign Up modes.
 * Matches the design with social login options, tabs, and specific layouts for each mode.
 */
export default function AuthPage() {
  // State for view mode: 'login' or 'signup'
  const [view, setView] = useState<'login' | 'signup'>('login')
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false)
  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  // State for error message
  const [error, setError] = useState("")
  // State for loading indicator
  const [loading, setLoading] = useState(false)

  // Router navigation and location
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  const { login, isAuthenticated } = useAuth()
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/app/dashboard"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Destination after login
  const from = (location.state as any)?.from?.pathname || "/dashboard"

  /**
   * Handles form submission for login and signup
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      })
      const token = response.data?.access_token || (response as any).access_token || (response as any).token
      login(token)
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error(err)
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleError = (err: any) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      setError("Invalid email or password.")
    } else {
      setError(err.message || "Authentication failed. Please try again.")
    }
  }

  /**
   * Handles input changes for form fields
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-[#1c1a14] p-4 text-on-surface">
      <style>{`
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-[400px] space-y-8 animate-fade-in">
        {/* Logo and Header */}
        <div className="flex flex-col items-start space-y-2">
          <img
            src="/mark-apple-icon.png"
            alt="Mark Logo"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-xl font-medium tracking-tight text-on-surface">
            {view === 'login' ? 'Log in to Mark' : 'Create your account'}
          </h1>
          <p className="text-on-surface-variant text-[15px] leading-relaxed max-w-xs">
            Welcome back to your AI workspace.
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email or username"
                value={formData.email}
                onChange={handleInputChange}
                className="h-13 rounded-2xl border-[1px] border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:border-[1px] focus:ring-0 px-4 text-[15px] shadow-xs transition-all outline-none ring-offset-0"
                required
                disabled={loading}
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-13 rounded-2xl border-[1px] border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:border-[1px] focus:ring-0 px-4 pr-12 text-[15px] shadow-xs transition-all outline-none ring-offset-0"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-13 mt-2 bg-[#a65698] hover:bg-[#904b83] text-white font-medium text-[15px] rounded-2xl shadow-xs transition-all active:scale-[0.98] border border-[1px] border-transparent"
              disabled={loading}
            >
              {loading ? "Processing..." : (view === 'login' ? "Log in" : "Sign up")}
            </Button>
          </form>

        </div>

        {/* Footer Actions */}
        <div className="space-y-4 pt-2">
          {view === 'login' && (
            <button
              className="block w-full text-left text-[14px] text-on-surface font-medium hover:text-on-surface-variant transition-colors"
              onClick={() => {/* handle forgot password */ }}
            >
              Forgot password?
            </button>
          )}

          <div className="text-[14px] text-on-surface-variant">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-on-surface font-medium hover:text-on-surface/80 transition-colors"
            >
              {view === 'login' ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center text-sm text-[#EF4444] font-medium px-4 py-2 bg-[#FEF2F2] rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
