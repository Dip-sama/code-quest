import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import icon from "../../assets/icon.png";
import Aboutauth from "./Aboutauth";
import { signup, login } from "../../action/auth";

const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Enter email and password");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Enter a valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Password should be at least 6 characters");
            return;
        }

        if (isSignup) {
            if (!name) {
                alert("Enter a name to continue");
                return;
            }
            dispatch(signup({ name, email, password }, navigate));
        } else {
            dispatch(login({ email, password }, navigate));
        }
    };

    const handleSwitch = () => {
        setIsSignup(!isSignup);
        setName("");  // Clearing values instead of setting defaults
        setEmail("");
        setPassword("");
    };

    return (
        <section className="auth-section">
            {isSignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className="login-logo" />
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!isSignup && (
                                <a
                                    href="/forgot-password"
                                    style={{ color: "#007ac6", fontSize: "13px" }}
                                >
                                    Forgot Password?
                                </a>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="auth-btn">
                        {isSignup ? "Sign up" : "Log in"}
                    </button>
                </form>
                <p>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button type="button" className="handle-switch-btn" onClick={handleSwitch}>
                        {isSignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
        </section>
    );
};

export default Auth;
