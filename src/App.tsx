import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar" // ✅ NEW

import Home from "./pages/Home"
import Results from "./pages/Results"
import SeatSelection from "./pages/SeatSelection"
import MyBookings from "./pages/MyBookings"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import PassengerDetails from "./pages/PassengerDetails"
import Confirmation from "./pages/Confirmation"
import Signup from "./pages/Signup"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        
        {/* ✅ Reusable Navbar */}
        <Navbar />

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/seats" element={<SeatSelection />} />
          <Route path="/passenger" element={<PassengerDetails />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App