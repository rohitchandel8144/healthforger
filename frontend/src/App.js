import Navbar from "./components/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";
import HabitTracker from "./pages/HabitTracker";
import GoalSetting from "./pages/GoalSetting";
import ShowArchive from "./components/ShowArchive";
import VerifyOtp from "./components/VerifyOtp";
import SendOtp from "./components/SendOtp";
import ProgressVisualizaion from "./pages/ProgressVisualization";
import GoogleCallback from "./pages/GoogleCallback";
import PaymentForm from "./components/PaymentForm";
import Admin from "./components/Admin";
// Import the GoogleCallback component

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/habittracker" element={<HabitTracker />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/progressvisualization"
              element={<ProgressVisualizaion />}
            />
            <Route path="/goalsetting" element={<GoalSetting />} />
            <Route path="/showarchive" element={<ShowArchive />} />
            <Route path="/paymentform" element={<PaymentForm />} />
            <Route path="/admin" element={<Admin />} />a
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sendotp" element={<SendOtp />} />
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path="/google/callback" element={<GoogleCallback />} />{" "}
          {/* Add Google OAuth callback route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
