"use client"; // Marks this as a client-side component in Next.js.

import { useRouter } from "next/navigation"; // Importing the router for navigation.

export default function HomePage() {
  const router = useRouter(); // Initializes the router for programmatic navigation.

  const handleAccessDashboard = () => {
    router.push("/login"); // Redirects the user to the "/login" page.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Main container with centered content, gradient background, and white text. */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-6">
          Bem-vindo ao <span className="text-blue-500">Nex Digital Challenge!</span>
          {/* Highlighted title with a blue accent. */}
        </h1>
        <p className="text-lg mb-8">
          Explore o dashboard e descubra as funcionalidades incríveis que preparamos para você.
          {/* Brief description of the app. */}
        </p>
        <button
          onClick={handleAccessDashboard}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          {/* Button with padding, rounded corners, hover effects, and a scaling animation. */}
          Acessar
        </button>
      </div>
    </div>
  );
}