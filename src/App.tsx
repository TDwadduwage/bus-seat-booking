import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Results from "./pages/Results"
import SeatSelection from "./pages/SeatSelection"
import PassengerDetails from "./pages/PassengerDetails"
import Confirmation from "./pages/Confirmation"
import MyBookings from "./pages/MyBookings"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/seats" element={<SeatSelection />} />
          <Route path="/passenger" element={<PassengerDetails />} />

          {/* 🔥 THIS IS THE MISSING ONE */}
          <Route path="/confirmation" element={<Confirmation />} />

          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App