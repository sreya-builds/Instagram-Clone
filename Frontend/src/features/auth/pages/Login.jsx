import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

const Login = () => {

    const { loading, handleLogin } = useAuth()

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
          
        await handleLogin(username,password)
          navigate('/')
    }


     if (loading) {
        return (<main>
            <h1>Loading.....</h1>
        </main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Instagram</h1>

                <form onSubmit={handleSubmit}>

                    <input
                          onInput={(e) => { setUsername(e.target.value) }}
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* 🔐 Password Field with Emoji Toggle */}
                    <div className="password-field">
                        <input
                            onInput={(e) => { setPassword(e.target.value) }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>

                    {/* ✅ Remember Me */}
                    <div className="remember-me">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember Me
                        </label>
                    </div>

                    <button
                        disabled={loading}
                        className="button primary-button"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* 🔁 Forgot Password */}
                <p>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>

                <p>
                    Don't have an account? <Link to="/register">Create One</Link>
                </p>

                <div className="social-buttons">
  <button className="button google-btn">
    <FcGoogle className="icon" />
    Google
  </button>

  <button className="button github-btn">
    <FaGithub className="icon" />
    GitHub
  </button>
</div>

            </div>
        </main>
    )
}

export default Login