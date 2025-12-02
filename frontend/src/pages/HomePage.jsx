import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useState } from "react";

const HomePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) navigate("/chats");
    }, [navigate]);

    return (
        <div className="max-w-xl w-full mx-auto">
            <div className="flex justify-center bg-glass w-full m-40px 0 15px 0 rounded-lg border border-white/20 p-4 mb-4">
                <h1 className="text-4xl font-light text-center text-gray-800">WebTalk</h1>
            </div>
            <div className="bg-glass w-full rounded-lg border border-white/20 p-6">
                <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                    <button
                        className={`flex-1 py-2 rounded-md transition-all ${activeTab === "login"
                                ? "bg-white shadow-sm text-gray-800 font-semibold"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md transition-all ${activeTab === "signup"
                                ? "bg-white shadow-sm text-gray-800 font-semibold"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
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
