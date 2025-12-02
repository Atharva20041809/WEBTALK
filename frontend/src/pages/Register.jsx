import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from '../services/api.js';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState(''); // added pic state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signupUser({ username, email, password, pic }); // included pic
      console.log('Signup response:', response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      alert('Signup successful!');
      navigate('/home');
    } catch (err) {
      if (err.response) {
        console.error('Backend responded with error:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Axios error:', err.message);
      }
      alert('Signup failed. See console for details.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Profile Picture URL"
          value={pic}
          onChange={e => setPic(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
