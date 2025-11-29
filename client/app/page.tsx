"use client"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-6 animate-bounce">Welcome to FinTrack</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Track your finances, get insights, and stay on top of your budget!
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition">
          Login/Signup
        </Link>
        
      </div>
    </div>
  )
}
