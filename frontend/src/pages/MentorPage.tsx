import { Link } from "react-router-dom";

export default function MentorPage() {
  return (
    <div className="min-h-screen bg-[#0B0E12] text-white pt-28 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Mentor Hub</h1>
            <p className="text-gray-400 text-sm">Share unbiased advice and help buyers pick the right car.</p>
          </div>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to Homepage</Link>
        </div>

        {/* Profile snapshot */}
        <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-5 mb-6 grid sm:grid-cols-[112px_1fr] gap-4">
          <div className="w-28 h-28 rounded-xl bg-white/10" />
          <div className="flex flex-col gap-1">
            <div className="text-lg font-medium">Your Mentor Profile</div>
            <div className="text-gray-400 text-sm">Experience, specialties, and pricing shown to clients.</div>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-300">
              <span className="px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10">EVs</span>
              <span className="px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10">Highway driving</span>
              <span className="px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10">Family cars</span>
            </div>
          </div>
        </div>

        {/* Upcoming sessions placeholder */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-5">
            <div className="font-medium mb-3">Upcoming Sessions</div>
            <div className="text-gray-400 text-sm">No sessions scheduled. Set availability to receive bookings.</div>
            <button className="mt-4 h-10 rounded-full bg-cyan-700 hover:bg-cyan-600 text-white px-4">Set Availability</button>
          </div>
          <div className="bg-white/5 rounded-xl ring-1 ring-white/10 p-5">
            <div className="font-medium mb-3">Earnings Snapshot</div>
            <div className="text-2xl">₹0</div>
            <div className="text-gray-400 text-sm">This week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
