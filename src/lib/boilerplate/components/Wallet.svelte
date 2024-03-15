<script>
    //// Boilerplate Web3 imports
    import { connectionStatus, user, chainId, alchemyNode, providerNode, visibilityUnsupportedNetworkBanner, visibilityConnectionOptions, triggerCdpsNavContractCalls, triggerCdpsAppContractCalls } from "$lib/boilerplate/js/stores/wallet";
    import { transactionRegister, pending } from "$lib/boilerplate/js/stores/transaction.ts";
    import { stethBalance,stethAllowance } from "$lib/boilerplate/js/stores/token.ts";
    import { content, visibility } from "$lib/boilerplate/js/stores/alert";
    import { EthereumProvider } from "@walletconnect/ethereum-provider";
    import { PROJECT_ID_WALLETCONNECT } from "$lib/boilerplate/js/env";
    import { networkNameByChainId, alchemyNodeKeyByChainId,abbreviate } from "$lib/boilerplate/js/core";
    import { onMount } from "svelte";
    import { ethers } from "ethers";

    //// Project web3 imports
    import  {userBalance} from "$lib/project/js/stores/projectDynamicValues";

    let metamaskIsInstalled = false;
    let metamaskProvider;
    let walletconnectProvider;
    let chosenConnectionMethod;

    onMount(async () => {
        //console.log("MOunted");
        // metamask logic
        metamaskProvider = await detectEthereumProvider();
        if (metamaskProvider && metamaskProvider == window.ethereum) {
            metamaskIsInstalled = true;
            window.ethereum.request({ method: "eth_accounts" }).then(async (accounts) => {
                if (accounts[0] != undefined) {
                    $user = accounts[0];
                    chosenConnectionMethod = "metamask";
                    $chainId = await window.ethereum.request({ method: "eth_chainId" });
                    if (networkNameByChainId.hasOwnProperty($chainId)) {
                        $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                        $triggerCdpsNavContractCalls = false;
                        $triggerCdpsNavContractCalls = true;
                        $triggerCdpsAppContractCalls = false;
                        $triggerCdpsAppContractCalls = true;
                    }
                    else {$visibilityUnsupportedNetworkBanner = "flex";}
                    $providerNode = new ethers.providers.Web3Provider(metamaskProvider);
                    $connectionStatus = "connected";
                }
            });
            window.ethereum.on("chainChanged", (_chainId) => {
                $providerNode = new ethers.providers.Web3Provider(metamaskProvider);
                if ($chainId != _chainId) {
                    resetBookkeeping();
                    let executeContractCalls = true;
                    if ($chainId == "0x0") {executeContractCalls = false;}
                    $chainId = _chainId;
                    if (networkNameByChainId.hasOwnProperty($chainId)) {
                        $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                        $visibilityUnsupportedNetworkBanner = "none";
                        if (executeContractCalls) {
                            $triggerCdpsNavContractCalls = false;
                            $triggerCdpsNavContractCalls = true;
                            $triggerCdpsAppContractCalls = false;
                            $triggerCdpsAppContractCalls = true;
                        }
                    }
                    else {$visibilityUnsupportedNetworkBanner = "flex";}
                }
            });
            window.ethereum.on("accountsChanged", (accounts) => {
                $providerNode = new ethers.providers.Web3Provider(metamaskProvider);
                if ($user != accounts[0]) {
                    resetBookkeeping();
                    if (accounts[0] != undefined) {
                        $user = accounts[0];
                        if (networkNameByChainId.hasOwnProperty($chainId)) {
                            $triggerCdpsNavContractCalls = false;
                            $triggerCdpsNavContractCalls = true;
                            $triggerCdpsAppContractCalls = false;
                            $triggerCdpsAppContractCalls = true;
                        }
                    }
                    else {
                        $connectionStatus = "disconnected";
                        $user = "0x0000000000000000000000000000000000000000";
                        $visibilityUnsupportedNetworkBanner = "none";
                    }
                }
            });
        }
        // walletconnect logic
        walletconnectProvider = await EthereumProvider.init({
            projectId: PROJECT_ID_WALLETCONNECT,
            chains: [89],
            showQrModal: true,
            qrModalOptions: {
                themeMode: "dark",
                explorerRecommendedWalletIds: [
                    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
                    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
                    "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
                    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
                    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
                    "647ced4fad747a3a613abfe160fed7deb4e85d8623ac9329e94b24dd0d86bf00",
                    "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3",
                    "cf14642fb8736a99b733ada71863241c823743b16e2a822b3dba24e2fa25014d"
                ]
            }
        });
        if (walletconnectProvider.accounts[0] != undefined) {
            $user = walletconnectProvider.accounts[0];
            chosenConnectionMethod = "walletconnect";
            $chainId = (walletconnectProvider.chainId).toString();
            if (!$chainId.startsWith("0x")) {$chainId = "0x" + $chainId;}
            if (networkNameByChainId.hasOwnProperty($chainId)) {
                $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                $triggerCdpsNavContractCalls = false;
                $triggerCdpsNavContractCalls = true;
                $triggerCdpsAppContractCalls = false;
                $triggerCdpsAppContractCalls = true;
            }
            else {$visibilityUnsupportedNetworkBanner = "flex";}
            $providerNode = new ethers.providers.Web3Provider(walletconnectProvider);
            $connectionStatus = "connected";
        }
        walletconnectProvider.on("accountsChanged", (accounts) => {
            chosenConnectionMethod = "walletconnect";
            $providerNode = new ethers.providers.Web3Provider(walletconnectProvider);
            resetBookkeeping();
            if ($user != accounts[0]) {
                if (accounts[0] != undefined) {
                    $user = accounts[0];
                    $chainId = (walletconnectProvider.chainId).toString();
                    if (!$chainId.startsWith("0x")) {$chainId = "0x" + $chainId;}
                    if (networkNameByChainId.hasOwnProperty($chainId)) {
                        $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                        $triggerCdpsNavContractCalls = false;
                        $triggerCdpsNavContractCalls = true;
                        $triggerCdpsAppContractCalls = false;
                        $triggerCdpsAppContractCalls = true;
                    }
                    else {$visibilityUnsupportedNetworkBanner = "flex";}
                    $connectionStatus = "connected";
                }
            }
        });
        walletconnectProvider.on("chainChanged", (_chainId) => {
            $providerNode = new ethers.providers.Web3Provider(walletconnectProvider);
            resetBookkeeping();
            if ($chainId != _chainId) {
                // both chainChanged & accountsChanged are triggered when the user connects => we only want to execute contract calls once
                let executeContractCalls = true;
                if ($chainId == "0x0") {executeContractCalls = false;}
                $chainId = _chainId;
                if (!$chainId.startsWith("0x")) {$chainId = "0x" + $chainId;}
                if (networkNameByChainId.hasOwnProperty($chainId)) {
                    $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                    $visibilityUnsupportedNetworkBanner = "none";
                    if (executeContractCalls) {
                        $triggerCdpsNavContractCalls = false;
                        $triggerCdpsNavContractCalls = true;
                        $triggerCdpsAppContractCalls = false;
                        $triggerCdpsAppContractCalls = true;
                    }
                }
                else {$visibilityUnsupportedNetworkBanner = "flex";}
            }
        });
    });

    async function connectMetaMask() {
        await window.ethereum.request({ method: "eth_requestAccounts" })
            .then(async (accounts) => {
                chosenConnectionMethod = "metamask";
                $chainId = await window.ethereum.request({ method: "eth_chainId" });
                if (networkNameByChainId.hasOwnProperty($chainId)) {
                    $alchemyNode = new Web3(alchemyNodeKeyByChainId[$chainId]);
                    $visibilityUnsupportedNetworkBanner = "none";
                    $triggerCdpsNavContractCalls = false;
                    $triggerCdpsNavContractCalls = true;
                    $triggerCdpsAppContractCalls = false;
                    $triggerCdpsAppContractCalls = true;
                }
                else {$visibilityUnsupportedNetworkBanner = "flex";}
                $providerNode = new ethers.providers.Web3Provider(metamaskProvider);
                $connectionStatus = "connected";
                $user = accounts[0];
            })
            .catch((error) => {
                if (error.code == -32002) {
                    $content["title"] = "Pending request";
                    $content["description"] = "Please check your MetaMask wallet.";   
                } 
                else {
                    $content["title"] = "Error";
                    $content["description"] = error.message;   
                }
                $visibility = "block";
            });
    }

    function disconnectMetaMask() {
        // Resetting the user and connection status
        user.set("0x0000000000000000000000000000000000000000");
        connectionStatus.set("disconnected");
        chainId.set("0x0");
        providerNode.set(null);

        // Add any other resets needed for your application state
        // ...

        // Optionally, you can remove the current account from local state
        // if you are storing it there.
        chosenConnectionMethod = null;
    }

    async function connectWalletConnect() {
        await walletconnectProvider.connect();
    }

    async function disconnectWalletConnect() {
        // does not trigger accountsChanged event
        await walletconnectProvider.disconnect();
        resetBookkeeping();
        $connectionStatus = "disconnected";
        $user = "0x0000000000000000000000000000000000000000";
        $chainId = "0x0";
        $visibilityUnsupportedNetworkBanner = "none";
    }

    function disconnectAllWallets(){
        disconnectMetaMask();
        disconnectWalletConnect();

    }

    function resetBookkeeping() {
        // transaction.js
        transactionRegister.set({}); pending.set([]);
        // protocol.js
        userBalance.set({});
        // token.js
        stethBalance.set("n/a");
        stethAllowance.set("n/a");
    }

    
</script>

<main>
    
    {#if $user != "0x0000000000000000000000000000000000000000"}
            <div class="">
                {#if chosenConnectionMethod == "walletconnect" || chosenConnectionMethod == "metamask"}
                <button id="disconnectButton" class="flex flex-col justify-center items-center h-10 w-24 rounded-r-md bg-blackPrim-light dark:bg-blackPrim-dark text-whitePrim-light dark:text-whitePrim-dark px-3.5 py-2 rounded-md hover:bg-greyed-light hover:text-whitePrim-light text-xs" on:click={() => disconnectAllWallets()}>
                    <div class="hover:scale-105">
                        <div id="Disconnect text" >Disconnect</div>
                        <div id="ConnectedWalletAddress"><p class="font-medium">{abbreviate($user, 5, 3)}</p></div>
                    </div>
                </button>
                
                {/if}
            </div>
    {:else}
        <button on:click={() => $visibilityConnectionOptions = "flex"} class="bg-blackPrim-light dark:bg-blackPrim-dark text-whitePrim-light dark:text-whitePrim-dark h-10 w-24 px-3.5 py-2 rounded-md  hover:bg-greyed-light hover:text-whitePrim-light">
            <div class="hover:scale-105">Connect</div>
        </button>
    {/if}

    
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" style="display: {$visibilityConnectionOptions};">
        <div class="relative">
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex w-screen max-w-md px-4">
                <button class="absolute top-0 right-4 text-black text-2xl z-20 p-2" on:click={() => $visibilityConnectionOptions = "none"}>&times;</button>
                <div class="w-full max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <div class="p-4">
                        {#if metamaskIsInstalled}
                            <button on:click={() => [$visibilityConnectionOptions = "none", connectMetaMask()]} class="text-left group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-100 w-full justify-between">
                                <div class="flex items-center gap-x-6">
                                    <div class="mt-1 flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <img src="/wallet/metamask.png" alt="MetaMask Logo">
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">MetaMask</p>
                                        <p class="mt-1 text-gray-600">Connect through MetaMask's browser extension (desktop only).</p>
                                    </div>
                                </div>
                            </button>
                            {:else}
                            <div class="class">MM not installed</div>
                        {/if}
                        <button on:click={() => [$visibilityConnectionOptions = "none", connectWalletConnect()]} class="text-left group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-100 w-full justify-between">
                            <div class="flex items-center gap-x-6">
                                <div class="mt-1 flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    <img src="/wallet/walletconnect.png" alt="WalletConnect Logo">
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">WalletConnect</p>
                                </div>
                            </div>
                        </button>
                    </div>                    
                </div>
            </div>
        </div>
    </div> 

</main>
