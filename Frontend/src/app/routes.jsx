import { Routes, Route } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<h2>Home</h2>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default RoutesConfig