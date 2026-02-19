// authPage.tsx
//
// This file defines the AuthPage component, which renders the login/signup forms with a modern card UI.
// It handles authentication state, toggles between login and signup views, and integrates with Firebase auth services.

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import {
  signInWithEmailAndPasswordsupafast,
  signUpWithEmailAndPassword,
  signInWithGoogle,
  signInWithApple
} from "../services/authService"
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

  // Auth context
  const { login } = useAuth()
  // Router navigation and location
  const navigate = useNavigate()
  const location = useLocation()

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
      if (view === 'signup') {
        const userCredential = await signUpWithEmailAndPassword(formData.email, formData.password)
        const token = await userCredential.user.getIdToken()
        login(token)
        navigate(from, { replace: true })
      } else {
        const userCredential = await signInWithEmailAndPasswordsupafast(formData.email, formData.password)
        const token = await userCredential.user.getIdToken()
        login(token)
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      console.error(err)
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true)
    setError("")

    try {
      let userCredential;
      if (provider === 'google') {
        userCredential = await signInWithGoogle()
      } else {
        userCredential = await signInWithApple()
      }

      const token = await userCredential.user.getIdToken()
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
    // improved error handling
    if (err.message === "User not found in database") {
      setError("User not found in database. Please contact support.");
    } else if (err.code === 'auth/email-already-in-use') {
      setError("Email already in use. Please login instead.")
    } else if (err.code === 'auth/weak-password') {
      setError("Password should be at least 6 characters.")
    } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      setError("Invalid email or password.")
    } else if (err.code === 'auth/popup-closed-by-user') {
      setError("Sign in was cancelled.")
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

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant"></span>
            </div>
            <span className="relative bg-surface px-4 text-[13px] text-on-surface-variant">
              Or authorize with
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="flex items-center justify-center h-[52px] rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-[13px] font-medium text-on-surface">Google</span>
              </div>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="flex items-center justify-center h-[52px] rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-on-surface">
                  <path d="M17.05 20.28c-.98.95-2.05 1.96-3.41 1.97-1.39 0-2.06-.88-3.66-.88-1.58 0-2.31.86-3.64.9-1.39.04-2.75-1.32-3.79-2.78-2.6-3.69-2.25-9.35 1.41-10.95 1.64-.73 2.85-.05 3.8-.05 1.02 0 2.45-1.06 4.31-1.06 1.48 0 2.92.73 3.75 1.83-3.21 1.76-2.58 6.48.56 7.84-.71 1.64-1.6 3.23-2.69 4.34 .36 .39 .71 .77 1.05 1.15l2.31-2.31zM12.03 7.25c-.21-2.29 2.46-3.77 2.46-3.77-.38-2.02-2.39-2.48-2.85-2.48-2.29.17-2.43 2.72-2.43 2.87 0 2.17 2.42 3.65 2.82 3.38z" />
                </svg>
                <span className="text-[13px] font-medium text-on-surface">Apple</span>
              </div>
            </button>
          </div>
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
