import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from '../services/api.js';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signupUser({ username, email, password });
      console.log('Signup response:', response.data);
      alert('Signup successful!');
      navigate('/home'); // or '/home'
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
        <button type="submit" >Signup</button>
      </form>
    </div>
  );
}

export default Register;
