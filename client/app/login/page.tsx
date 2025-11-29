"use client"

import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase/config"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export default function LandingPage() {
  const router = useRouter()
  const provider = new GoogleAuthProvider()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard") // redirect after login
    } catch (err: any) {
      console.error("Google Sign-In Error:", err.message)
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
      <h1 className="text-5xl font-bold mb-6 animate-bounce">Welcome to FinTrack</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Track your finances, get insights, and stay on top of your budget!
      </p>

      {/* Google Sign-In button directly on landing page */}
      <button
        onClick={handleGoogleSignIn}
        className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
      >
        Continue with Google
      </button>
    </div>
  )
}

