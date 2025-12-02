import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            alert("Please Select an Image!");
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            alert("Please Select an Image!");
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            alert("Please Fill all the Feilds");
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            alert("Passwords Do Not Match");
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "http://localhost:3000/api/user/signup",
                {
                    username: name,
                    email,
                    password,
                    pic,
                },
                config
            );
            alert("Registration Successful");
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
                <label className="font-semibold text-gray-700">Name</label>
                <input
                    type="text"
                    placeholder="Enter Your Name"
                    className="input-field"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="input-field"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Password</label>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        className="input-field"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="absolute right-2 top-3 text-sm font-bold text-gray-600"
                        onClick={() => setShow(!show)}
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Confirm Password</label>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="input-field"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <button
                        className="absolute right-2 top-3 text-sm font-bold text-gray-600"
                        onClick={() => setShow(!show)}
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Upload your Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    className="p-1.5 border border-gray-300 rounded"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </div>
            <button
                className="btn btn-primary w-full mt-4"
                onClick={submitHandler}
                disabled={loading}
            >
                {loading ? "Loading..." : "Sign Up"}
            </button>
        </div>
    );
};

export default Signup;
