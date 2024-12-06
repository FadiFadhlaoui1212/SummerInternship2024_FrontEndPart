import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css'; // Import the new CSS file

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [livingPlace, setLivingPlace] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const navigate = useNavigate();

    async function save(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:9090/api/clients", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                birthDate: birthDate,
                livingPlace: livingPlace,
                birthPlace: birthPlace,
            });
            alert("Client Registration successful!");
            navigate("/"); // Redirect to the Login page after successful registration
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className="container">
            <div className="card">
                <h1>Client Registration</h1>
                <form>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter your First Name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter your Last Name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your Email"
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
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Birth Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="birthDate"
                            placeholder="Enter your Birth Date"
                            value={birthDate}
                            onChange={(event) => setBirthDate(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Living Place</label>
                        <input
                            type="text"
                            className="form-control"
                            id="livingPlace"
                            placeholder="Enter your Living Place"
                            value={livingPlace}
                            onChange={(event) => setLivingPlace(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Birth Place</label>
                        <input
                            type="text"
                            className="form-control"
                            id="birthPlace"
                            placeholder="Enter your Birth Place"
                            value={birthPlace}
                            onChange={(event) => setBirthPlace(event.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-4" onClick={save}>
                        Save
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary mt-4"
                        onClick={() => navigate("/")}
                    >
                        Go to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
