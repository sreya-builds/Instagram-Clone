import { useState } from "react"
import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaDiscord } from "react-icons/fa"
import axios from "axios"
import "./auth.css"

const Register = () => {

  const [darkMode, setDarkMode] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      )

      console.log(response.data)
      alert("Registered Successfully 🔥")

      // optional: clear form
      setUsername("")
      setEmail("")
      setPassword("")

    } catch (error) {
      console.log(error.response?.data || error.message)
      alert("Registration Failed ❌")
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
        <h2>Create Account</h2>

        <div className="input-group">
          <input 
            type="text" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Username</label>
        </div>

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

        <button type="submit">Register</button>

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
          Already have an account?{" "}
          <Link to="/login"><span>Login</span></Link>
        </div>

      </form>
    </div>
  )
}

export default Register