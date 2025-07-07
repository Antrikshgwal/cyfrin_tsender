"use client"
import AirdropForm from "@/components/AirdropForm";
import {useAccount} from "wagmi"
export default function Home() {
  const {isConnected} = useAccount();
  return (
    <div>
      {isConnected ? (<div>
        <AirdropForm/>
      </div>) : (
<div className="flex flex-col justify-center items-center text-2xl mt-10 font-bold ">

 <h1> Please connect your wallet...
 </h1>
 </div>
      )}

    </div>
  );
}
