// wallet.ts
import { writable } from 'svelte/store';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { PROJECT_ID_WALLETCONNECT } from '$lib/boilerplate/js/env';
import { ethers } from 'ethers';
import { networkNameByChainId, alchemyNodeKeyByChainId } from '$lib/boilerplate/js/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { get } from "svelte/store";

export const connectionStatus = writable('disconnected');
export const user = writable('0x0000000000000000000000000000000000000000');
export const chainId = writable('0x0');
export const alchemyNode = writable('');
export const providerNode = writable<JsonRpcProvider | null>(null);
export const visibilityUnsupportedNetworkBanner = writable('none');
export const triggerCdpsNavContractCalls = writable(false);
export const triggerCdpsAppContractCalls = writable(false);

let walletconnectProvider: any;

export async function initializeWalletConnect() {
    console.log("Initialising wallet connect");
        walletconnectProvider = await EthereumProvider.init({
        projectId: PROJECT_ID_WALLETCONNECT,
        chains: [1, 137], // Ethereum and Polygon chain IDs
        showQrModal: true,
    });
    console.log("walletconnectProvider = ", walletconnectProvider);

    // Convert WalletConnect provider to ethers provider and set global providerNode
    const ethersProvider = new JsonRpcProvider(walletconnectProvider as any);
    providerNode.set(ethersProvider);
    console.log("ethersProvider = ", ethersProvider);

    // Handle initial connection
    if (walletconnectProvider.accounts && walletconnectProvider.accounts[0]) {
        updateUserAndChain(walletconnectProvider.accounts[0], walletconnectProvider.chainId.toString());
    }

    // Listen for account changes
    walletconnectProvider.on('accountsChanged', (accounts: string[]) => {
        const newAccount = accounts[0] || '0x0000000000000000000000000000000000000000';
        updateUserAndChain(newAccount, walletconnectProvider.chainId.toString());
    });

    // Listen for chain changes
    walletconnectProvider.on('chainChanged', (newChainId: string) => {
        updateUserAndChain(walletconnectProvider.accounts[0], newChainId.toString());
    });

    connectionStatus.set('initialized');
}

// Update user and chainId stores, along with other dependent stores
function updateUserAndChain(newUser: string, newChainId: string) {
  user.set(newUser);
  console.log("user ", get(user));
  chainId.set(newChainId);
  console.log("chainId ", get(chainId));

  if (newUser !== '0x0000000000000000000000000000000000000000' && networkNameByChainId.hasOwnProperty(newChainId)) {
    alchemyNode.set(alchemyNodeKeyByChainId[newChainId]);
    visibilityUnsupportedNetworkBanner.set('none');
    triggerContractCalls();
  } else {
    visibilityUnsupportedNetworkBanner.set('flex');
  }

  connectionStatus.set(newUser === '0x0000000000000000000000000000000000000000' ? 'disconnected' : 'connected');
}

// Trigger contract calls
function triggerContractCalls() {
  triggerCdpsNavContractCalls.set(false);
  triggerCdpsNavContractCalls.set(true);
  triggerCdpsAppContractCalls.set(false);
  triggerCdpsAppContractCalls.set(true);
}

export async function connectWallet() {
  await walletconnectProvider.connect();
  console.log("Wallet connected");
}

export async function disconnectWallet() {
  await walletconnectProvider.disconnect();
  resetStores();
}

function resetStores() {
  user.set('0x0000000000000000000000000000000000000000');
  chainId.set('0x0');
  providerNode.set(null);
  connectionStatus.set('disconnected');
  visibilityUnsupportedNetworkBanner.set('none');
}