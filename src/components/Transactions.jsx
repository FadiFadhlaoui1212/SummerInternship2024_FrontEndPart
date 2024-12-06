import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Transactions() {
    const [clientId, setClientId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedClient = localStorage.getItem('client');
        if (storedClient) {
            const clientData = JSON.parse(storedClient);
            setClientId(clientData.id);
        }

        const fetchTransactions = async () => {
            if (clientId) {
                try {
                    const response = await axios.get(`http://localhost:9090/transaction/${clientId}`);
                    setTransactions(response.data);
                } catch (err) {
                    setError("Failed to fetch transactions.");
                    console.error(err);
                }
            }
        };

        fetchTransactions();
    }, [clientId]);

    // Inline style for h1 (only text styling)
    const headingStyle = {
        color: 'white', // White text color
        fontFamily: "'Helvetica Neue', sans-serif", // Elegant font
        fontSize: '36px', // Larger font size
        fontWeight: '600', // Semi-bold text
        textAlign: 'center', // Center the text
        padding: '20px', // Padding for spacing
    };

    return (
        <div>
            <h1 style={headingStyle}>Welcome to the Transactions Page</h1>

            {/* Navigation bar */}
            <nav>
                <button onClick={() => navigate('/home')}>Home</button>
                <button onClick={() => navigate('/transactions')}>Transactions</button>
                <button onClick={() => {
                    localStorage.removeItem('client');
                    localStorage.removeItem('accounts');
                    navigate('/');
                }}>Logout</button>
            </nav>

            {error && <p>{error}</p>}
            {transactions.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Account Number</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.transaction_id}>
                                <td>{transaction.transaction_id}</td>
                                <td>{transaction.account.account_number}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.transaction_date}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.account.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
}

export default Transactions;
