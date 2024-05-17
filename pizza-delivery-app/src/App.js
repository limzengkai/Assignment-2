import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./view/LogIn";
import SignUp from "./view/Signup";
import ForgotPassword from "./view/ForgotPassword";
import Homepage from "./view/Homepage";
import OrderPage from "./view/OrderPage";
import Checkout from "./view/CheckoutPage";
import ProtectedRoute from "./view/Component/ProctectedRoute";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        console.log("DATA", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Homepage />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
