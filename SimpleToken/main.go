package main

import (
	"fmt"
	"strconv"

	"github.com/p2eengineering/kalp-sdk-public/kalpsdk"
)

// SmartContract provides functions for managing user balances
type SmartContract struct {
	kalpsdk.Contract
}

const balancePrefix = "account~balance"

// AddBalance adds a uint64 amount to the current balance of the user
func (s *SmartContract) AddBalance(ctx kalpsdk.TransactionContextInterface, account string, amount uint64) error {
	if amount <= 0 {
		return fmt.Errorf("amount must be positive")
	}

	// Create composite key for the balance
	balanceKey, err := ctx.CreateCompositeKey(balancePrefix, []string{account})
	if err != nil {
		return fmt.Errorf("failed to create composite key for balance: %v", err)
	}

	// Retrieve current balance
	balanceBytes, err := ctx.GetState(balanceKey)
	if err != nil {
		return fmt.Errorf("failed to retrieve balance: %v", err)
	}

	var currentBalance uint64
	if balanceBytes != nil {
		currentBalance, _ = strconv.ParseUint(string(balanceBytes), 10, 64)
	}

	// Add the amount to the current balance
	newBalance := currentBalance + amount

	// Store the updated balance
	newBalanceBytes := []byte(strconv.FormatUint(newBalance, 10))
	err = ctx.PutStateWithoutKYC(balanceKey, newBalanceBytes)
	if err != nil {
		return fmt.Errorf("failed to update balance: %v", err)
	}

	return nil
}

// RemoveBalance removes a uint64 amount from the current balance of the user
func (s *SmartContract) RemoveBalance(ctx kalpsdk.TransactionContextInterface, account string, amount uint64) error {
	if amount <= 0 {
		return fmt.Errorf("amount must be positive")
	}

	// Create composite key for the balance
	balanceKey, err := ctx.CreateCompositeKey(balancePrefix, []string{account})
	if err != nil {
		return fmt.Errorf("failed to create composite key for balance: %v", err)
	}

	// Retrieve current balance
	balanceBytes, err := ctx.GetState(balanceKey)
	if err != nil {
		return fmt.Errorf("failed to retrieve balance: %v", err)
	}

	var currentBalance uint64
	if balanceBytes != nil {
		currentBalance, _ = strconv.ParseUint(string(balanceBytes), 10, 64)
	} else {
		return fmt.Errorf("account %s does not have enough balance", account)
	}

	// Check if there are enough funds to remove
	if currentBalance < amount {
		return fmt.Errorf("insufficient balance in account %s", account)
	}

	// Subtract the amount from the current balance
	newBalance := currentBalance - amount

	// Store the updated balance
	newBalanceBytes := []byte(strconv.FormatUint(newBalance, 10))
	err = ctx.PutStateWithoutKYC(balanceKey, newBalanceBytes)
	if err != nil {
		return fmt.Errorf("failed to update balance: %v", err)
	}

	return nil
}

// GetBalance retrieves the current balance of the user
func (s *SmartContract) GetBalance(ctx kalpsdk.TransactionContextInterface, account string) (uint64, error) {
	// Create composite key for the balance
	balanceKey, err := ctx.CreateCompositeKey(balancePrefix, []string{account})
	if err != nil {
		return 0, fmt.Errorf("failed to create composite key for balance: %v", err)
	}

	// Retrieve current balance
	balanceBytes, err := ctx.GetState(balanceKey)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve balance: %v", err)
	}

	var balance uint64
	if balanceBytes != nil {
		balance, _ = strconv.ParseUint(string(balanceBytes), 10, 64)
	}

	return balance, nil
}

func main() {
	// Start the chaincode in the main function
	chaincode, err := kalpsdk.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating chaincode: %v\n", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %v\n", err)
	}
}
