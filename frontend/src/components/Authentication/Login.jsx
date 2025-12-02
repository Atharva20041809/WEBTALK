import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            alert("Please fill all the fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/user/login`,
                { email, password },
                config
            );

            alert("Login Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Login Failed"));
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="input-group">
                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                className="btn btn-primary btn-block"
                onClick={submitHandler}
                disabled={loading}
            >
                {loading ? "Loading..." : "Login"}
            </button>
        </div>
    );
};

export default Login;
