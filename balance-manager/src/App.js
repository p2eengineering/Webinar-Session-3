import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [getBalanceAccount, setGetBalanceAccount] = useState("");
  const [addBalanceAccount, setAddBalanceAccount] = useState("");
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const [removeBalanceAccount, setRemoveBalanceAccount] = useState("");
  const [removeBalanceAmount, setRemoveBalanceAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");

  // API URL (replace with your actual API endpoint)
  const apiUrl = "https://gateway-api.kalp.studio/v1/contract/kalp";
  const contractAddress = "ZHzpkUzbYDeuX3cCRBC6xIeUMdxlg4Ua1726523221325";
  const apikey =
    "39a27e70317aef284ec11fafbd52a5353eab3b9458b8b232da7020a2a9e820402ce1038708780a6f8897a577038192c13ffa78d81cf46e442eec758d51c66134bb6003";

  // Get balance function
  const getBalance = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/query/${contractAddress}/GetBalance`,
        {
          network: "TESTNET",
          blockchain: "KALP",
          walletAddress: "a90efceaef54bfc007e829f3584b0cfcdf4a7bbf",
          args: {
            account: getBalanceAccount,
          },
        },
        { headers: { "Content-Type": "application/json", "x-api-key": apikey } }
      );
      setBalance(response.data.result.result);
      setMessage("");
    } catch (error) {
      setMessage("Error fetching balance");
    }
  };

  // Add balance function
  const addBalance = async () => {
    try {
      await axios.post(
        `${apiUrl}/invoke/${contractAddress}/AddBalance`,
        {
          network: "TESTNET",
          blockchain: "KALP",
          walletAddress: "a90efceaef54bfc007e829f3584b0cfcdf4a7bbf",
          args: {
            account: addBalanceAccount,
            amount: parseInt(addBalanceAmount),
          },
        },
        { headers: { "Content-Type": "application/json", "x-api-key": apikey } }
      );
      setMessage("Balance added successfully");
      setBalance(null); // Reset the balance display
    } catch (error) {
      setMessage("Error adding balance");
    }
  };

  // Remove balance function
  const removeBalance = async () => {
    try {
      await axios.post(
        `${apiUrl}/invoke/${contractAddress}/RemoveBalance`,
        {
          network: "TESTNET",
          blockchain: "KALP",
          walletAddress: "a90efceaef54bfc007e829f3584b0cfcdf4a7bbf",
          args: {
            account: removeBalanceAccount,
            amount: parseInt(removeBalanceAmount),
          },
        },
        { headers: { "Content-Type": "application/json", "x-api-key": apikey } }
      );
      setMessage("Balance removed successfully");
      setBalance(null); // Reset the balance display
    } catch (error) {
      setMessage("Error removing balance");
    }
  };

  return (
    <div className="App">
      <h1>Balance Manager</h1>

      {/* Get Balance Section */}
      <div>
        <h2>Get Balance</h2>
        <input
          type="text"
          placeholder="Enter Account"
          value={getBalanceAccount}
          onChange={(e) => setGetBalanceAccount(e.target.value)}
        />
        <button onClick={getBalance}>Get Balance</button>
        {balance !== null && <h3>Current Balance: {balance}</h3>}
      </div>

      {/* Add Balance Section */}
      <div>
        <h2>Add Balance</h2>
        <input
          type="text"
          placeholder="Enter Account"
          value={addBalanceAccount}
          onChange={(e) => setAddBalanceAccount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Amount"
          value={addBalanceAmount}
          onChange={(e) => setAddBalanceAmount(e.target.value)}
        />
        <button onClick={addBalance}>Add Balance</button>
      </div>

      {/* Remove Balance Section */}
      <div>
        <h2>Remove Balance</h2>
        <input
          type="text"
          placeholder="Enter Account"
          value={removeBalanceAccount}
          onChange={(e) => setRemoveBalanceAccount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Amount"
          value={removeBalanceAmount}
          onChange={(e) => setRemoveBalanceAmount(e.target.value)}
        />
        <button onClick={removeBalance}>Remove Balance</button>
      </div>

      {/* Message Section */}
      {message && <h3>{message}</h3>}
    </div>
  );
}

export default App;
