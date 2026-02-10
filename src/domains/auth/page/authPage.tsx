// authPage.tsx
//
// This file defines the AuthPage component, which renders the login form and handles user authentication.
// It manages form state, error handling, and redirects after successful login.
// The page is styled with Tailwind CSS and uses UI primitives for layout and interactivity.

import React, { useState } from "react"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { login as loginService } from "../services/authService"
import { useAuth } from "../hooks/useAuth"

/**
 * AuthPage
 *
 * Renders the login form and handles authentication logic.
 * - Manages form state and error handling
 * - Redirects to the intended page after login
 * - Styled with Tailwind CSS and UI primitives
 */
export default function AuthPage() {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false)
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
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
   * Handles form submission for login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await loginService(formData.username, formData.password)
      login(data.access_token)
      navigate(from, { replace: true })
    } catch (err) {
      setError("Invalid credentials")
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Login
          </CardTitle>
          <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-gray-200 text-black focus:border-pink-400 focus:ring-pink-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-gray-200 text-black focus:border-pink-400 focus:ring-pink-400"
                  required
                  disabled={loading}
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-400" disabled={loading} />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Error message if present */}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-purple-600 hover:text-purple-800 font-semibold">
                Register
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
