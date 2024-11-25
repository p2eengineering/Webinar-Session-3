import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { ethers } from "ethers";

function App() {
  const [getBalanceAccount, setGetBalanceAccount] = useState("");
  const [addBalanceAccount, setAddBalanceAccount] = useState("");
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const [removeBalanceAccount, setRemoveBalanceAccount] = useState("");
  const [removeBalanceAmount, setRemoveBalanceAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");

  // API URL (replace with your actual API endpoint)
  const apiUrl = "https://gateway-api.kalp.studio/v1/contract/evm";
  const contractAddress = "0x60Dd89dA47638c2bf0a69cD02cd180ed4EE6455b";
  const apikey =
    "3ff178776627ee774e9218aebf52a56569ff3b940febe832dc2676a3aaef734574e204d708780a6f8897a577038192c13ffa78d81cf46e442eec758d51c66134bb6003";

  // Get balance function
  const getBalance = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/query/${contractAddress}/ShowBalance`,
        {
          network: "AMOY",
          blockchain: "POLY",
          walletAddress: "0xBf59E83ecC7de8e774b37fa4b958DE6e5A0C5471",
          args: {
            account: getBalanceAccount,
          },
        },
        { headers: { "Content-Type": "application/json", "x-api-key": apikey } }
      );

      console.log(response);
      setBalance(ethers.getBigInt(response.data.result.result.hex).toString());
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Error fetching balance");
    }
  };

  // Add balance function
  const addBalance = async () => {
    try {
      await axios.post(
        `${apiUrl}/invoke/${contractAddress}/AddBalance`,
        {
          network: "AMOY",
          blockchain: "POLY",
          walletAddress: "0xBf59E83ecC7de8e774b37fa4b958DE6e5A0C5471",
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
          network: "AMOY",
          blockchain: "POLY",
          walletAddress: "0xBf59E83ecC7de8e774b37fa4b958DE6e5A0C5471",
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
