import { writable } from "svelte/store";

export const connectionStatus = writable("disconnected");
export const user = writable("0x0000000000000000000000000000000000000000");
export const chainId = writable("0x0");
export const alchemyNode = writable("n/a");
export const providerNode = writable("n/a");
export const visibilityUnsupportedNetworkBanner = writable("none");
export const visibilityConnectionOptions = writable("none");

export const triggerCdpsNavContractCalls = writable(false);
export const triggerCdpsAppContractCalls = writable(false);