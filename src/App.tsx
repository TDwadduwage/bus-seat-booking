import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
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
import Payment from "./pages/Payment"

// ✅ Hide navbar on auth pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup"

  return (
    <div className="min-h-screen bg-slate-100">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />

          {/* 🔥 IMPORTANT: keep this consistent everywhere */}
          <Route path="/seats" element={<SeatSelection />} />

          <Route path="/passenger" element={<PassengerDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />

          {/* USER */}
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ✅ FALLBACK (prevents blank page) */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
              </div>
            }
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App