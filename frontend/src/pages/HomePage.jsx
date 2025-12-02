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
            <div className="card d-flex justify-center m-2">
                <h1>WebTalk</h1>
            </div>
            <div className="card m-2">
                <div className="d-flex gap-2" style={{ marginBottom: "20px" }}>
                    <button
                        className={`btn w-100 ${activeTab === "login" ? "btn-primary" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`btn w-100 ${activeTab === "signup" ? "btn-primary" : ""}`}
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
