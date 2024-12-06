import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios"; // Assuming you are using Axios for API calls
import './Home.css';

function Home() {
    const [firstName, setFirstName] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default currency is USD
    const navigate = useNavigate();

        // Define headingStyle to be reused
        const headingStyle = {
            color: 'white', // White text color
            fontFamily: "'Helvetica Neue', sans-serif", // Elegant font
            fontSize: '36px', // Larger font size
            fontWeight: '600', // Semi-bold text
            textAlign: 'center', // Center the text
            padding: '20px', // Padding for spacing
        };

    useEffect(() => {

        const storedClient = localStorage.getItem('client');

        if (storedClient) {
            const clientData = JSON.parse(storedClient);
            setFirstName(clientData?.firstName || ''); // Default to empty string if clientData or firstName is undefined
        } else {
            setFirstName(''); // Handle when no client is found in localStorage
        }


        const storedAccounts = localStorage.getItem('accounts');
        const accountsData = JSON.parse(storedAccounts);

        setAccounts(accountsData || []); // Set accounts, default to empty array if null
    }, []); // Ensure useEffect only runs once after the component mounts



    // Function to handle account creation
    const createNewAccount = async () => {
        const storedClient = localStorage.getItem('client');
        const clientData = JSON.parse(storedClient);
        const currentDate = new Date().toISOString(); // Get current date and time in ISO format

        const newAccount = {
            client: clientData, // Use clientData from local storage
            account_balance: 0.0, // Default balance
            opening_date: currentDate,
            currency: selectedCurrency, // Use the selected currency from the dropdown
        };

        try {
            // Send the new account data to your backend API
            const response = await axios.post(`http://localhost:9090/account/create`, newAccount);

            // Assuming the API returns the created account
            const createdAccount = response.data;

            // Add the new account to the existing accounts array
            setAccounts((prevAccounts) => [...prevAccounts, createdAccount]);

            // Update local storage
            localStorage.setItem('accounts', JSON.stringify([...accounts, createdAccount]));

            alert("New account created successfully!");
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Failed to create a new account.");
        }
    };

       // Function to handle depositing money
       const depositMoney = async (accountNumber) => {
        const inputField = document.getElementById(`depositAmount-${accountNumber}`);
        const amount = inputField.value;

        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const accountResponse = await axios.get(`http://localhost:9090/account/${accountNumber}`);
        const account = accountResponse.data;

        const newTransaction = {
            account: account,
            type: "Deposit",
            transaction_date: new Date().toISOString(),
            amount: amount,
        };

        try {
            const response = await axios.put(`http://localhost:9090/account/deposit/${accountNumber}/${amount}`);
            const updatedAccount = response.data;

            const response1 = await axios.post(`http://localhost:9090/transaction/create`, newTransaction);

            // Update the local accounts list and localStorage with the new balance
            const updatedAccounts = accounts.map(account => 
                account.account_number === accountNumber ? updatedAccount : account
            );

            setAccounts(updatedAccounts);
            localStorage.setItem('accounts', JSON.stringify(updatedAccounts));

            alert(`Successfully deposited ${amount} to account ${accountNumber}.`);
            inputField.value = ''; // Clear the input after successful deposit

        } catch (error) {
            console.error("Error depositing money:", error);
            alert("Failed to deposit money.");
        }
    };


          // Function to handle withdrawing money
          const withdrawMoney = async (accountNumber) => {
            const inputField = document.getElementById(`withdrawAmount-${accountNumber}`);
            const amount = inputField.value;
    
            if (!amount || isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            const accountResponse = await axios.get(`http://localhost:9090/account/${accountNumber}`);
            const account = accountResponse.data;
    
            const newTransaction = {
                account: account,
                type: "Withdraw",
                transaction_date: new Date().toISOString(),
                amount: amount,
            };
    
            try {
                const response = await axios.put(`http://localhost:9090/account/withdraw/${accountNumber}/${amount}`);
                const updatedAccount = response.data;

                const response1 = await axios.post(`http://localhost:9090/transaction/create`, newTransaction);
    
                // Update the local accounts list and localStorage with the new balance
                const updatedAccounts = accounts.map(account => 
                    account.account_number === accountNumber ? updatedAccount : account
                );
    
                setAccounts(updatedAccounts);
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    
                alert(`Successfully withdrawn ${amount} from account ${accountNumber}.`);
                inputField.value = ''; // Clear the input after successful deposit
            } catch (error) {
                console.error("Error withdrawing money:", error);
                alert("Failed to withdraw money.");
            }
        };


        const handleLogout = async () => {
            const storedClient = localStorage.getItem('client');
            if (!storedClient) {
                alert("No client is logged in.");
                return;
            }
        
            const clientData = JSON.parse(storedClient);
            const clientEmail = clientData.email;
        
            try {
                // Make the API call to log off the client in the backend
                await axios.put(`http://localhost:9090/api/clients/switchOut/${clientEmail}`);
        
                // Clear local storage for client and accounts
                localStorage.removeItem('client');
                localStorage.removeItem('accounts');
        
                // Redirect to login page
                navigate('/');
                alert("You have successfully logged out.");
            } catch (error) {
                console.error("Error logging out:", error);
                alert("Failed to log out. Please try again.");
            }
        };
        





    const deleteAccount = async (accountNumber) => {
        console.log(`Attempting to delete account with account number: ${accountNumber}`);
    
        
        const response1 = await axios.delete(`http://localhost:9090/transaction/delete/${accountNumber}`);
        const response = await axios.delete(`http://localhost:9090/account/delete/${accountNumber}`);
        
        console.log('Response:', response); // Log the response
        console.log('Response', response1);

        const updatedAccounts = accounts.filter((account) => account.account_number !== accountNumber);
    
        // Update the accounts state and local storage
        setAccounts(updatedAccounts);
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    
        alert("Account deleted successfully!");
    };
    
    

    return (


        <div>
    <h1 style={headingStyle}>Welcome {firstName}</h1>


            

            <nav>
                    <li>
                        <button onClick={() => navigate('/home')}>Home</button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/transactions')}>Transactions</button>
                    </li>
                    <li>
                        {/* Logout button */}
                        <button onClick={handleLogout}>Logout</button>
                    </li>
            </nav>

            {/* Currency selection dropdown */}
            <label htmlFor="currency" style={headingStyle}>Choose currency: </label>
            <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
            >
                <option value="USD">Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">Pound (GBP)</option>
            </select>

            {/* Button to create a new account */}
            <button onClick={createNewAccount}>Create New Account</button>

            <h2 style={headingStyle}>Your Accounts</h2>

            {/* Check if accounts exist and display them in a table */}
            {accounts.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Balance</th>
                            <th>Opening Date</th>
                            <th>Currency</th>
                            <th>Delete</th>
                            <th>Deposit Money</th>
                            <th>Withdraw Money</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account, index) => (
                            <tr key={index}>
                                <td>{account.account_number}</td>
                                <td>{account.account_balance}</td>
                                <td>{account.opening_date}</td>
                                <td>{account.currency}</td>
                                <td>
                                    {/* Delete button for each account */}
                                    <button onClick={() => deleteAccount(account.account_number)}>
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    {/* Input for deposit amount and button to deposit money in the same <td> */}
                                        <input
                                        type="number"
                                        id={`depositAmount-${account.account_number}`}
                                        placeholder="Enter amount"
                                        step="0.01" // For decimal values
                                        style={{ marginRight: '10px' }} // Optional: Add some spacing between input and button
                                        />
                                        <button onClick={() => depositMoney(account.account_number)}>
                                            Deposit Money
                                        </button>
                                </td>
                                <td>
                                    {/* Input for deposit amount and button to deposit money in the same <td> */}
                                        <input
                                        type="number"
                                        id={`withdrawAmount-${account.account_number}`}
                                        placeholder="Enter amount"
                                        step="0.01" // For decimal values
                                        style={{ marginRight: '10px' }} // Optional: Add some spacing between input and button
                                        />
                                        <button onClick={() => withdrawMoney(account.account_number)}>
                                            Withdraw Money
                                        </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No accounts found.</p>
            )}
        </div>
    );
}

export default Home;
