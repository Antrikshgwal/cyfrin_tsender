"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig} from "@rainbow-me/rainbowkit"

import {
  mainnet,
  anvil,
  zksync
} from 'wagmi/chains';


const config = getDefaultConfig({
    appName: 'tsender',
    projectId: "2180fdf0f048655e989f01e0ad7efe5d",
    chains: [mainnet, zksync, anvil],
    ssr: false, // If your dApp uses server side rendering (SSR)
  });

  export default config;