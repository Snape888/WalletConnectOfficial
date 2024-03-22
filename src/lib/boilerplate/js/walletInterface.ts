import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { PROJECT_ID_WALLETCONNECT } from "$lib/boilerplate/js/env";
import {
  user,
  chainId,
  providerNode,
  connectionStatus,
  alchemyNode,
  visibilityUnsupportedNetworkBanner,
  triggerCdpsNavContractCalls,
  triggerCdpsAppContractCalls
} from "$lib/boilerplate/js/stores/wallet";
import { ethers } from "ethers";
import { networkNameByChainId, alchemyNodeKeyByChainId } from "$lib/boilerplate/js/core";
import { JsonRpcProvider } from '@ethersproject/providers';

// Initialize WalletConnect
async function initializeWalletConnect() {
    const walletconnectProvider = await EthereumProvider.init({
        projectId: PROJECT_ID_WALLETCONNECT,
        chains: [1, 137], // Ethereum and Polygon chain IDs
        showQrModal: true,
    });

    // Convert WalletConnect provider to ethers provider and set global providerNode
    const ethersProvider = new JsonRpcProvider(walletconnectProvider as any);
    providerNode.set(ethersProvider);

    // Handle initial connection
    if (walletconnectProvider.accounts && walletconnectProvider.accounts[0]) {
        updateUserAndChain(walletconnectProvider.accounts[0], walletconnectProvider.chainId.toString());
    }

    // Listen for account changes
    walletconnectProvider.on("accountsChanged", (accounts: string[]) => {
        const newAccount = accounts[0] || "0x0000000000000000000000000000000000000000";
        updateUserAndChain(newAccount, walletconnectProvider.chainId.toString());
    });

    // Listen for chain changes
    walletconnectProvider.on("chainChanged", (newChainId: string) => {
        updateUserAndChain(walletconnectProvider.accounts[0], newChainId.toString());
    });

    connectionStatus.set("initialized");
}

// Update user and chainId stores, along with other dependent stores
function updateUserAndChain(newUser: string, newChainId: string) {
    user.set(newUser);
    chainId.set(newChainId);

    if (newUser !== "0x0000000000000000000000000000000000000000" && networkNameByChainId.hasOwnProperty(newChainId)) {
        alchemyNode.set(alchemyNodeKeyByChainId[newChainId]);
        visibilityUnsupportedNetworkBanner.set("none");
        triggerContractCalls();
    } else {
        visibilityUnsupportedNetworkBanner.set("flex");
    }

    connectionStatus.set(newUser === "0x0000000000000000000000000000000000000000" ? "disconnected" : "connected");
}

// Trigger contract calls
function triggerContractCalls() {
    triggerCdpsNavContractCalls.set(false);
    triggerCdpsNavContractCalls.set(true);
    triggerCdpsAppContractCalls.set(false);
    triggerCdpsAppContractCalls.set(true);
}

export { initializeWalletConnect };