import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Results from "./pages/Results"
import SeatSelection from "./pages/SeatSelection"
import PassengerDetails from "./pages/PassengerDetails"
import Payment from "./pages/Payment"
import Confirmation from "./pages/Confirmation"
import MyBookings from "./pages/MyBookings"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./pages/AdminDashboard"
import ConductorDashboard from "./pages/ConductorDashboard"
import ConductorScanner from "./pages/ConductorScanner"
import SeatMapDashboard from "./pages/SeatMapDashboard"

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const hideNavbar = ["/login", "/signup"].includes(location.pathname)

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

          {/* CONDUCTOR */}
          <Route path="/conductor" element={<ConductorDashboard />} />
          <Route path="/scanner" element={<ConductorScanner />} />
          <Route path="/seat-map/:busId" element={<SeatMapDashboard />} />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">
                  404 - Page Not Found
                </h2>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App