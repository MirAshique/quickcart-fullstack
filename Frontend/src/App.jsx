import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";
import Cart from "./pages/public/Cart";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Checkout from "./pages/public/Checkout";
import OrderSuccess from "./pages/public/OrderSuccess";
import Orders from "./pages/public/Orders";
import OrderDetails from "./pages/public/OrderDetails";
import VerifyEmail from "./pages/public/VerifyEmail";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import ResendVerification from "./pages/public/ResendVerification";
import VerifyOTP from "./pages/public/VerifyOTP";
import Profile from "./pages/user/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* ================= PUBLIC LAYOUT ================= */}
        <Route path="/" element={<MainLayout />}>

          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="verify/:token" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset/:token" element={<ResetPassword />} />
          <Route path="resend-verification" element={<ResendVerification />} />
          <Route path="verify-otp" element={<VerifyOTP />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>

        </Route>

        {/* ================= ADMIN LAYOUT ================= */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
