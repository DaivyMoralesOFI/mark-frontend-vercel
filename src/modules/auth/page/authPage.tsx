// authPage.tsx
//
// This file defines the AuthPage component, which renders the login/signup forms with a modern card UI.
// It handles authentication state, toggles between login and signup views, and integrates with Firebase auth services.

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { signInWithEmailAndPasswordsupafast, signUpWithEmailAndPassword } from "../services/authService"
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
      // improved error handling
      if (err.code === 'auth/email-already-in-use') {
        setError("Email already in use. Please login instead.")
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.")
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.")
      } else {
        setError(err.message || "Authentication failed. Please try again.")
      }
    } finally {
      setLoading(false)
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
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-4 text-on-surface text-center">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes appear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-appear {
          animation: appear 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center mb-8 animate-appear opacity-0">
          <img
            src="/mark-apple-icon.png"
            alt="Mark Logo"
            className="w-16 h-16 object-contain"
          />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-on-surface">
            Mark
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {view === 'login' ? 'Welcome back to your AI workspace' : 'Start your journey with Mark'}
          </p>
        </div>

        <div className="animate-appear opacity-0 delay-100">
          <Card className="bg-surface overflow-hidden border-none shadow-none text-left">
            <CardContent className="px-6 pb-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-on-surface text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 border-outline bg-surface-container-lowest text-on-surface placeholder:text-muted-foreground focus:border-primary focus:ring-primary rounded-lg transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-on-surface text-sm font-medium">
                      Password
                    </Label>
                    {view === 'login' && (
                      <a href="#" className="text-xs font-medium text-primary hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pr-10 h-11 border-outline bg-surface-container-lowest text-on-surface placeholder:text-muted-foreground focus:border-primary focus:ring-primary rounded-lg transition-all"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant hover:text-on-surface opacity-70 transition-colors"
                      tabIndex={-1}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {view === 'login' ? (
                  <Button
                    type="submit"
                    className="w-full h-11 mt-4 bg-[#1a1a1a] hover:bg-black text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Logging in...
                      </div>
                    ) : "Log In"}
                  </Button>
                ) : (
                  <>
                    <div className="flex items-start space-x-2 pt-2 pb-2">
                      <input
                        id="newsletter"
                        type="checkbox"
                        className="mt-1 rounded border-outline text-primary focus:ring-primary h-4 w-4"
                      />
                      <label htmlFor="newsletter" className="text-xs text-on-surface-variant leading-relaxed select-none">
                        Please keep me updated by email with the latest news, research findings, reward programs, and event updates.
                      </label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </div>
                      ) : "Create an account"}
                    </Button>
                  </>
                )}
              </form>

              {error && (
                <div className="mt-6 text-center text-sm text-error font-medium bg-error/5 border border-error/10 p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="animate-appear opacity-0 delay-200">
          <Card className="bg-surface rounded-2xl p-4 text-center border-none shadow-none">
            <p className="text-sm text-on-surface-variant">
              {view === 'login' ? "Don't have an account yet?" : "Already have an account?"}{" "}
              <button
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                className="font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-1 underline-offset-4"
              >
                {view === 'login' ? "Sign up" : "Login"}
              </button>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )

}
