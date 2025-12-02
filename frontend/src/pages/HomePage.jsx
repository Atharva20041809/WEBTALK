import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const HomePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) navigate("/chats");
    }, [navigate]);

    return (
        <div className="container">
            <div className="card" style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ margin: 0, fontSize: "36px", color: "#0084ff" }}>WebTalk</h1>
                <p style={{ margin: "10px 0 0 0", color: "#65676b" }}>
                    Connect with friends and colleagues
                </p>
            </div>

            <div className="card">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`tab ${activeTab === "signup" ? "active" : ""}`}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                {activeTab === "login" ? <Login /> : <Signup />}
            </div>
        </div>
    );
};

export default HomePage;
