"use client"

import React, { useState, useMemo, ChangeEvent } from 'react';

interface TokenTransferFormProps {
    onSubmit: (data: {
        tokenAddress: string;
        recipients: string[];
        amountPerRecipient: number;
        totalAmount: number;
    }) => void;
}

export const TokenTransferForm: React.FC<TokenTransferFormProps> = ({ onSubmit }) => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipientsInput, setRecipientsInput] = useState('');
    const [amountPerRecipient, setAmountPerRecipient] = useState('');

    // Calculate total token amount and parse recipient addresses
    const { recipients, totalAmount } = useMemo(() => {
        const recipientList = recipientsInput
            .split(/[\n,]+/) // Split by new lines or commas
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0);

        const amount = parseFloat(amountPerRecipient) || 0;
        const total = recipientList.length * amount;

        return {
            recipients: recipientList,
            totalAmount: total
        };
    }, [recipientsInput, amountPerRecipient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            tokenAddress,
            recipients,
            amountPerRecipient: parseFloat(amountPerRecipient) || 0,
            totalAmount
        });
    };

    return (
        <form onSubmit={handleSubmit} className="   space-y-4 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <div>
                <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">
                    Token Address
                </label>
                <input
                    type="text"
                    id="tokenAddress"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="0x..."
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
                    Recipient Addresses (comma or newline separated)
                </label>
                <textarea
                    id="recipients"
                    value={recipientsInput}
                    onChange={(e) => setRecipientsInput(e.target.value)}
                    placeholder="0x123..., 0x456... or one per line"
                    rows={5}
                    className="mt-1 text-black  block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                <p className="mt-1 text-sm text-gray-500">
                    {recipients.length} recipient(s) detected
                </p>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount Per Recipient
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amountPerRecipient}
                    onChange={(e) => setAmountPerRecipient(e.target.value)}
                    min="0"
                    step="0.0001"
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-black">Summary</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-black ">Recipients</p>
                        <p className="text-sm font-semibold text-black">{recipients.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-black ">Total Tokens</p>
                        <p className="text-sm font-semibold text-black">{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit Transfer
            </button>
        </form>
    );
};