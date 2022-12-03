import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import Google and Facebook icons
import './App.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Link } from 'react-router-dom'; // Import Link from React Router
import bodyImage from './assets/images/backs.jpg';
import { useNavigate } from 'react-router-dom';




function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login (navigate to dashboard or show success message)
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container mt-5">
    <img src={bodyImage} alt="Background Wall" className="body-image" />

      <div className="card p-5">
        <h3 className="mb-1">Employee Login</h3>
        <label className="account-label">
          Don't have an account yet?{' '}
          <Link to="/signup" class="sign">
            Sign Up.
            </Link>
        </label>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <label class="label">Forgot Password?</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleTogglePassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} className='mt-3'>
        <hr style={{ width: '45%', margin: '0' }} />
        <span style={{ width: '10%', textAlign: 'center' }}>Or</span>
         <hr style={{ width: '45%', margin: '0' }} />
        </div>

        <div className="mt-3">
          <button type="button" className="btn btn-danger btn-primary mb-2">
            <FaGoogle size={20} color="white" className="me-2" />
            Google
          </button>
          <button type="button" className="btn btn-primary">
            <FaFacebook size={20} color="white" className="me-2" />
            Facebook
          </button>
        </div>

        <p className="mt-3 text-muted text-center">
          All Rights Reserved &copy; EPI-USE Africa
        </p>
      </div>
    </div>
  );
}

export default Login;
