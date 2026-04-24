'use client';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">KetCe Catering</h1>
        <p className="text-xl mb-8">Order Management System</p>
        <a
          href="/dashboard"
          className="bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
