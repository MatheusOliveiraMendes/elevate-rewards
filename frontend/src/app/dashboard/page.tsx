"use client"; // Marks this as a client-side component.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirects to "/login" if no token is found.
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Main container with centered content, gradient background, and white text. */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-6">
          Bem-vindo ao <span className="text-blue-500">Nex Digital Challenge!</span>
          {/* Highlighted title with a blue accent. */}
        </h1>
        <p className="text-lg mb-8">Este é o dashboard.</p>
        {/* Brief description of the dashboard. */}
      </div>
    </div>
  );
}