import React, { useState, useMemo } from 'react';

interface TokenTransferFormProps {
    onSubmit: (data: {
        tokenAddress: string;
        recipients: string[];
        amounts: number[];
        totalAmount: number;
    }) => void;
}

export const TokenTransferForm: React.FC<TokenTransferFormProps> = ({ onSubmit }) => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipientsInput, setRecipientsInput] = useState('');
    const [amountsInput, setAmountsInput] = useState('');
    const [loading, setLoading] = useState(false);

    const { recipients, amounts, totalAmount, isValid, errors } = useMemo(() => {
        const parseList = (input: string) =>
            input
                .split(/[\n,]+/)
                .map(item => item.trim())
                .filter(item => item.length > 0);

        const recipients = parseList(recipientsInput);
        const amountStrings = parseList(amountsInput);
        const amounts = amountStrings.map(str => parseFloat(str));

        const errors: string[] = [];

        if (recipients.length !== amounts.length) {
            errors.push(`Recipients count (${recipients.length}) does not match amounts count (${amounts.length}).`);
        }

        const invalidAmounts = amountStrings.filter((str, idx) => isNaN(amounts[idx]) || amounts[idx] < 0);
        if (invalidAmounts.length > 0) {
            errors.push(`Some amounts are invalid or negative: ${invalidAmounts.join(', ')}`);
        }

        const totalAmount = amounts.reduce((sum, amt) => isNaN(amt) || amt < 0 ? sum : sum + amt, 0);
        const isValid = errors.length === 0;

        return { recipients, amounts, totalAmount, isValid, errors };
    }, [recipientsInput, amountsInput]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({ tokenAddress, recipients, amounts, totalAmount });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
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
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
                    rows={4}
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                />
                <p className="mt-1 text-sm text-gray-500">{recipients.length} recipient(s) detected</p>
            </div>

            <div>
                <label htmlFor="amounts" className="block text-sm font-medium text-gray-700">
                    Amount Per Recipient (comma or newline separated)
                </label>
                <textarea
                    id="amounts"
                    value={amountsInput}
                    onChange={(e) => setAmountsInput(e.target.value)}
                    placeholder="10, 15.5, 20 or one per line"
                    rows={4}
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                />
                <p className="mt-1 text-sm text-gray-500">{amounts.length} amount(s) detected</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">Summary</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-black">Recipients</p>
                        <p className="text-sm font-semibold text-black">{recipients.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-black">Total Tokens</p>
                        <p className="text-sm font-semibold text-black">{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                {errors.length > 0 && (
                    <div className="mt-3 text-sm text-red-600 space-y-1">
                        {errors.map((err, i) => (
                            <p key={i}>⚠️ {err}</p>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={!isValid}
            >
                Submit Transfer
            </button>
        </form>
    );
};
