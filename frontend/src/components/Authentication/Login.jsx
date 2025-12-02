import { useState } from "react";
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
            alert("Please Fill all the Feilds");
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
                "http://localhost:3000/api/user/login",
                { email, password },
                config
            );

            alert("Login Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert("Error Occured: " + error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Password</label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                className="btn btn-primary w-full mt-4"
                onClick={submitHandler}
                disabled={loading}
            >
                {loading ? "Loading..." : "Login"}
            </button>
            <button
                className="btn w-full mt-2 bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </button>
        </div>
    );
};

export default Login;
