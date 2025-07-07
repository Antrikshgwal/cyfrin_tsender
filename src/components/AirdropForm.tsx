"use client";
import React, { useState, useMemo } from "react";
import { chainsToTSender, erc20Abi, tsenderAbi } from "../constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import {useDebounce} from "../hooks/useDebounce"
import {useEffect} from 'react'

const AirdropForm = () => {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();



  const [tokenAddress, setTokenAddress] = useState(() => localStorage.getItem("tokenAddress") || "");
const [recipientsInput, setRecipientsInput] = useState(() => localStorage.getItem("recipientsInput") || "");
const [amountsInput, setAmountsInput] = useState(() => localStorage.getItem("amountsInput") || "");
  const [loading, setLoading] = useState(false);
  const [txState, setTxState] = useState<"idle" | "wallet" | "pending" | "success" | "failed" >("idle")
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const debouncedTokenAddress = useDebounce(tokenAddress,500);
  const debouncedRecipientsInput = useDebounce(recipientsInput,500);
  const debouncedAmountsInput = useDebounce(amountsInput,500);


  const {data:tokendata} = useReadContracts({
    contracts : [
      {
        abi : erc20Abi,
        address : tokenAddress as `0x${string}`,
        functionName: 'decimals'
      },
      {
        abi : erc20Abi,
        address : tokenAddress as `0x${string}`,
        functionName: 'name'
      },
      {
        abi : erc20Abi,
        address : tokenAddress as `0x${string}`,
        functionName: 'balanceOf',
        args:[account.address]
      },
      {
        abi : erc20Abi,
        address : tokenAddress as `0x${string}`,
        functionName: 'currency'
      },

    ]
  })




  useEffect(() => {
    localStorage.setItem("tokenAddress", debouncedTokenAddress);
  }, [debouncedTokenAddress]);

  useEffect(() => {
    localStorage.setItem("recipientsInput", debouncedRecipientsInput);
  }, [debouncedRecipientsInput]);

  useEffect(() => {
    localStorage.setItem("amountsInput", debouncedAmountsInput);
  }, [debouncedAmountsInput]);

  const { recipients, amounts, totalAmount, isValid, errors } = useMemo(() => {
    const parseList = (input: string) =>
      input
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    const recipients = parseList(recipientsInput);
    const amountStrings = parseList(amountsInput);
    const amounts = amountStrings.map((str) => parseFloat(str));

    const errors: string[] = [];

    if (recipients.length !== amounts.length) {
      errors.push(
        `Recipients count (${recipients.length}) does not match amounts count (${amounts.length}).`
      );
    }

    const invalidAmounts = amountStrings.filter(
      (str, idx) => isNaN(amounts[idx]) || amounts[idx] < 0
    );
    if (invalidAmounts.length > 0) {
      errors.push(
        `Some amounts are invalid or negative: ${invalidAmounts.join(", ")}`
      );
    }

    const totalAmount = amounts.reduce(
      (sum, amt) => (isNaN(amt) || amt < 0 ? sum : sum + amt),
      0
    );
    const isValid = errors.length === 0;

    return { recipients, amounts, totalAmount, isValid, errors };
  }, [recipientsInput, amountsInput]);

  async function getAllowance(
    tsenderAddress: string,
    tokenAddress: string
  ): Promise<number> {
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress as `0x${string}`],
    });
    return Number(response);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
setLoading(true);
    setTxState("wallet");
    setTransactionHash(null);

    try {
      const tsenderAddress = chainsToTSender[chainId].tsender;
      const approvedAmount = await getAllowance(tsenderAddress, tokenAddress);

      if (approvedAmount < totalAmount) {
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tsenderAddress as `0x${string}`, BigInt(totalAmount)],
        });
        setTxState("wallet");
        await waitForTransactionReceipt(config, { hash: approvalHash });

        const airDropHash = await writeContractAsync({
          abi: tsenderAbi,
          address: tsenderAddress as `0x${string}`,
          functionName: "airdropERC20",
          args: [
            tokenAddress,
            recipients,
            amounts.map((amt) => BigInt(Math.floor(amt))),
            BigInt(Math.floor(totalAmount)),
          ],
        });

setTxState("pending")
        await waitForTransactionReceipt(config, { hash: airDropHash });
setTxState("success");

  setTokenAddress("");
  setRecipientsInput("");
  setAmountsInput("");

  localStorage.removeItem("tokenAddress");
  localStorage.removeItem("recipientsInput");
  localStorage.removeItem("amountsInput");

  alert("transaction succesful!")
        setTransactionHash(airDropHash);

      }else{

      const airDropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recipients,
          amounts.map((amt) => BigInt(Math.floor(amt))),
          BigInt(Math.floor(totalAmount)),
        ],
      });

      setTxState("success");

        setTokenAddress("");
        setRecipientsInput("");
        setAmountsInput("");

        localStorage.removeItem("tokenAddress");
        localStorage.removeItem("recipientsInput");
        localStorage.removeItem("amountsInput");

      alert("transaction succesful!")
      await waitForTransactionReceipt(config, { hash: airDropHash });
      setTransactionHash(airDropHash);
    }
    } catch (err) {
      console.error("Error during submission:", err);
      setTxState("failed");
      setLoading(false);
    } finally {

      setLoading(false);
    }
  };


  const getButtonContent = () => {
    const label = {
      idle: "Transfer",
      wallet: "Confirm in wallet...",
      pending: "Submitting transaction...",
      success: "Transfer",
      failed: "❌ Failed, try again",
    }[txState];

    return (
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        <span>{label}</span>
      </div>
    );
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 mt-5 bg-white rounded-lg shadow-md"
    >
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
        <div className="mt-2 flex flex-col  gap-4">
        <div className="flex justify-between ">
            <p className="text-sm text-black">Token Name</p>
            <p className="text-sm font-semibold text-black">{tokendata?.[1].result as string}</p>
          </div>

          <div className="flex justify-between ">
            <p className="text-sm text-black">Amount(in wei)</p>
            <p className="text-sm font-semibold text-black">{totalAmount.toLocaleString()}</p>
          </div>
        <div className="flex justify-between ">
            <p className="text-sm text-black">Amount(tokens)</p>
            <p className="text-sm font-semibold text-black">{(totalAmount/10**(tokendata?.[0].result as number)) as number }</p>
          </div>
          <div className="flex justify-between ">
            <p className="text-sm text-black">Recipients</p>
            <p className="text-sm font-semibold text-black">{recipients.length}</p>
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
        disabled={!isValid || loading}
      >
            {getButtonContent()}
      </button>

      {transactionHash && (
        <div className="text-sm text-green-700 mt-2 text-wrap ">
          {/* ✅ Transaction submitted: <code>{transactionHash}</code> */}
        </div>
      )}
    </form>
  );
};

export default AirdropForm;
