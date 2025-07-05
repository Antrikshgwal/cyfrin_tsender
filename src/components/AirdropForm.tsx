"use client"
import { useEffect, useState } from "react"
import React from 'react'
import { TokenTransferForm } from "./ui/inputField"
import { chainsToTSender } from "../constants"
import { useChainId, useConfig, useAccount } from "wagmi"
import { readContract } from '@wagmi/core';
import { erc20Abi } from "../constants"


interface TransferData {
  tokenAddress: string;
  recipients: string[];
  amountPerRecipient: number;
  totalAmount: number;
}


const AirdropForm = () => {

  const chainId = useChainId();
  const config = useConfig()
  const account = useAccount();



  async function handleSubmit(data: TransferData) {
    console.log("Submitting...")




    //WorkFlow
    // 1. Approve tsender contract to send tokens
    // 1a. If already approved, move to step 2
    // 2. Call the AirDrop function
    // 3. Wait to mine the transactio
    const tsenderAddress = chainsToTSender[chainId].tsender;
    console.log(chainId);
    console.log(tsenderAddress);
    const approvedAmount = await getApproved(tsenderAddress, data.tokenAddress);
    console.log(approvedAmount)
  }


  // Even if the state variables will  change it will not be reflected in the ui because the ui will not render again, to make sure that app re-renders after the state variables are changed we use useeffect

  // Implements a getter to fetch the total approved tokens by reading from allowance function
  async function getApproved(tsenderAddress: string | null, tokenAddress: string| null): Promise<number> {
    if (!tsenderAddress) {
      alert('No address found. Switch to correct chain')
      return 0;
    }
    // read from the chain from allowance function

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [tsenderAddress as `0x${string}` , account.address ],
    })
    return response as number
  }









  return (
    <div className='m-4'>
      <TokenTransferForm onSubmit={handleSubmit} />
    </div>
  )
}

export default AirdropForm
