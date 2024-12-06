import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css'; // Make sure this path is correct

async function searchClient(email) {
    try {
        const response = await axios.get(`http://localhost:9090/api/clients/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching client:", error);
        throw error;
    }
}

async function getAccounts(id) {
    try {
        const response = await axios.get(`http://localhost:9090/account/clients/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        setErrorMessage(""); // Reset error messages
        try {
            const response = await axios.post("http://localhost:9090/api/clients/login", {
                email: email,
                password: password,
            });

            if (response.data.message === "Email not exits") {
                setErrorMessage("Email does not exist.");
            } else if (response.data.message === "Login success") {
                try {
                    const client = await searchClient(email);
                    localStorage.setItem('client', JSON.stringify(client));
                    const accounts = await getAccounts(client.id);
                    localStorage.setItem('accounts', JSON.stringify(accounts));
                    alert("You have successfully logged in!");
                    navigate('/home');
                } catch (err) {
                    setErrorMessage("Failed to fetch client details.");
                }
            } else {
                setErrorMessage("Incorrect Email and Password don't match.");
            }
        } catch (err) {
            setErrorMessage("An error occurred during login. Please try again.");
        }
    }

    return (
        <div className="container">
            <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#services" className="nav-link">Service</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
            <div className="login-card">
                <h2>Login</h2>
                <hr />

                <form onSubmit={login}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Login
                    </button>
                </form>

                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    
    );
}

export default Login;
