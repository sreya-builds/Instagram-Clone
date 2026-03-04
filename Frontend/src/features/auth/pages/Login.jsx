import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaDiscord } from "react-icons/fa"
import axios from "axios"
import "./auth.css"

const Login = () => {

  const [darkMode, setDarkMode] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      )

      console.log(response.data)
      alert("Login Successful 🔥")

      // Redirect after login
      navigate("/")

    } catch (error) {
      console.log(error.response?.data || error.message)
      alert("Invalid Credentials ❌")
    }
  }

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <form className="auth-card" onSubmit={handleSubmit}>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="logo">DUAL STACK</div>
        <h2>Welcome Back</h2>

        <div className="input-group">
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button type="submit">Login</button>

        <div className="divider">OR</div>

        <div className="social-row">
          <button type="button" className="social-btn google">
            <FcGoogle /> Google
          </button>

          <button type="button" className="social-btn github">
            <FaGithub /> GitHub
          </button>

          <button type="button" className="social-btn discord">
            <FaDiscord /> Discord
          </button>
        </div>

        <div className="switch-text">
          Don't have an account?{" "}
          <Link to="/register"><span>Register</span></Link>
        </div>

      </form>
    </div>
  )
}

export default Login