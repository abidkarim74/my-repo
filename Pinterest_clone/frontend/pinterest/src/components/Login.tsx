import React, { useState, ChangeEvent, FormEvent } from "react";
import api from "../api/apiRequests.tsx";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await api.post("token/", { email, password });
      const data = response.data;
      window.location.assign("/");

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="auth-card">
        {error && <div className="auth-error">{error}</div>}
        <input
          type="email"
          name="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />
        <input
          type="password"
          name="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
        {!loading &&
        <button type="submit" className="auth-button">
          Login
        </button>
        }
        {loading && 
          <button type="submit" className="auth-button">
          Loading...
          </button>

        }
      </form>
    </div>
  );
};

export default Auth;
