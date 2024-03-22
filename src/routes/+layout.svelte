<script lang="ts">
  /// Svelte imports
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import { slide } from "svelte/transition";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { ethers } from "ethers";
  import Countup from "svelte-countup";
  import { JsonRpcProvider } from "@ethersproject/providers";

  import {account, provider, chains} from "$lib/web3modal";

  /// Boilerplate Web3 imports
  import {
    getWalletBalances,
    checkAllowances,
    updateCurrentSelectedDropdowns,
    updateContractAddresses,
    runViewFunction,
    fromWei,
    toWei,
    convertUnixTimestampToDate,
    calculateDifferenceBetweenTimestamps,
    formatDuration,
    checkNFTAllowance,
    getPendingConversionData,
    updatePricePerCoin,
    updateAvailableToRedeem,
    toTitleCase    
  } from "$lib/project/js/helpers.ts";

  import { BigNumber } from "bignumber.js";

  import {
    networkNameByChainId,
    alchemyNodeKeyByChainId,
    abbreviate,
  } from "$lib/boilerplate/js/core";

  import { 
    createExchangeDepositsVaultsArray,
    createSystemLoans,
    createMyLoansArray,
    getPreviewStatsForEarnDeposit,
    updateExchangeRates,
    getSupportedNetworks,
    createRedeemableIOUsArray
  } from "$lib/project/js/FAVfunctionCalls.ts";



  

  /// Project Web3 imports
  import {
    userBalance,
    borrowVaults,
    mortgagePoolContractFunctions,
    mortgagePoolContractValues,
    depositVaults,
    walletBalances,
    dropDownSelectionsNames,
    dropDownSelections,
    depositSwapVaults,
    exchangeDepositVaults,
    redeemableNFTs,
    recievableNFTs,
    loanNFTs,
    redeemableIOUBalances,
    contractAddresses,
    vaultLoans,
    systemVaults,
    referralLink,
    copied,
    referUser,
    supportedNetworks,
    supportedNetworkNames,
    txProcessMessage,
    connectedAndSupported,
    user,
    chainId,
    providerNode
  } from "$lib/project/js/stores/projectDynamicValues.ts";
  import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
  import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
  import erc20Abi from "$lib/boilerplate/abi/erc-20.json";

  import mortgageContractsAbi from "$lib/project/abi/mortgagecontracts.sol/mortgagecontracts.json";

  // Project specific imports
  import { protocolInfo } from "$lib/project/js/stores/projectDynamicValues.ts";
  import {
    pages,
    currentPage,
    themeColours,
    roundedCornersSm,
    roundedCornersLg,
  } from "$lib/project/js/stores/brandAndTheme.ts";

  // Boilerplate components
  import Header from "$lib/boilerplate/components/Header.svelte";
  import { _round } from "$lib/boilerplate/js/core";
  import Button from "$lib/boilerplate/components/Button.svelte";
  import LineAnimation from "$lib/boilerplate/components/LineAnimation.svelte";

  //let connectedAndSupported = false;






  const duration = 2500; // Duration for rotation and scale up/down

  const rotation = tweened(0, { easing: cubicInOut });
  const scale = tweened(1, { easing: cubicInOut }); // Start with the original scale
  let currentRotation = 0;

  function startAnimation() {
      currentRotation += 360; // Increment the rotation
      rotation.set(currentRotation, { duration });

      // Toggle scale between 1 and 1.2
      scale.set(1.3, { duration: duration / 2 }) // Scale up in the first half
          .then(() => scale.set(1, { duration: duration / 3 })); // Then scale down in the second half

      setTimeout(startAnimation, 5000 + duration); // Wait for the entire duration + 5 seconds before starting the next cycle
  }


  let showReferralLink = false; // Initialize as boolean
  let accountAddress = '';
// Reactive statement to update showReferralLink based on the user's wallet address
$: showReferralLink = 
  $user && $user !== "0x0000000000000000000000000000000000000000" ? true : false;


  let accountLoaded = false;
  let previousAddress = '';
  // Reactive statement to wait for account to be loaded and detect user changes
  $: if ($account && $account.address && $account.chainId && $provider && Object.keys(alchemyNodeKeyByChainId).length > 0) {
    if ($account.address !== previousAddress) {
      console.log("User changed, triggering user loading");
      $user = $account.address;
      $chainId = $account.chainId;
      $providerNode = $provider;
      accountLoaded = true;
      loadFavUser();
      handleRefLink();
      previousAddress = $account.address;
    } else if (!accountLoaded) {
      console.log("About to trigger user loading");
      $user = $account.address;
      $chainId = $account.chainId;
      $providerNode = $provider;
      accountLoaded = true;
      loadFavUser();
      handleRefLink();
    }
  }


  /// Web3 functions ---------------------------------------------------------

  onMount(async () => {
    console.log("On Mount started in +layout");

    // Subscribe to the account store
    account.subscribe(value => {
      accountAddress = value?.address || '';
    });

    

   // await initializeWalletConnect();
    // Start the initial fav tokenrotation
    startAnimation(); // Start the initial animation
    //toggleuse("mint");

    
  });

  async function handleRefLink(){
    let path = window.location.pathname;
    let ref = path.split("/").pop();
    console.log("ref1", ref);
    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    console.log("format", cookies.referral);
    if (ref && ref.startsWith("/")) {
      ref = ref.substring(1);
      console.log("reeef");
    }
    if (
      ref &&
      ref.length > 1 &&
      ref !== "borrow" &&
      ref !== "earn" &&
      ref !== "convert" &&
      ref !== "system" &&
      ref !== "docs" &&
      ref !== "dashboard" &&
      ref !== ""
    ) {
      console.log('starSwith',ref, ref.startsWith("0x"),ref.length)
      if (ref.startsWith("0x")) {
        console.log("ref2", ref);
        referUser.set(ref);
        document.cookie = `referral=${ref}; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/`;
      } else {
        async function AddyFromEns() {
        console.log('pullingENS');
        const providerValue = $providerNode;
        console.log('Provider node = ', $providerNode);
        console.log('chainId = ', $chainId);
        if (providerValue !== null && $chainId) {
          const providerUrl = alchemyNodeKeyByChainId[Number($chainId)]; // Get the provider URL
          const provider = new JsonRpcProvider(providerUrl);
          console.log('provider pulled');
          const ensName = ref ? await provider.resolveName(ref) : undefined;
          console.log("ensName", ensName);
          if (ref && ensName) {
            referUser.set(ensName);
            document.cookie = `referral=${ensName}; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/`;
          } else {
            referUser.set(undefined);
          }
        } else {
          console.error('Provider value is null');
          // Handle the case when the provider value is null
          // You can throw an error, provide a fallback provider, or take appropriate action
        }
      }

        console.log("format", cookies.referral);
        document.cookie = `referral=${ref}; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/`;
        AddyFromEns();
      }
      console.log("after", document.cookie);
      console.log("plur", cookies);
      console.log('what',$referUser)

      /*  async function getEnsName() {
                const provider = new ethers.providers.JsonRpcProvider($alchemyNode);
                const ensName = await provider.lookupAddress($referUser);
                console.log('ensName',ensName)
                if (ensName) {
                  $referUser = ensName;
                } 
                
              }*/
     // $referUser = cookies.referral;
    }
  }



  // Populate FAV Earn dropdowns
  async function createDepositVaultsArray() {
    const networkVaults = mortgageContractsInfo[Number($chainId)].vaults;
    const depositVaultsArray: any[] = [];
    let i = 0; // Initialize the counter outside the loops

    for (const vaultKey in networkVaults) {
      const vault = networkVaults[vaultKey];
      depositVaultsArray.push({
        id: i++,
        tokenIcon: vault.tokens["Stablecoin"].tokenIcon,
        ticker: vault.ticker,
        tokenGreyed: false,
        available: "20%", // Placeholder for current APRs
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
      });
    }

    $depositVaults = depositVaultsArray;
    console.log("depositVaults = ", $depositVaults);
  }

  

  // Populate FAV Swap dropdowns
  // Populate with depositable erc20a
  async function createDepositSwapVaultsArray() {
    const networkVaults = mortgageContractsInfo[Number($chainId)].vaults;
    const depositSwapVaultsObject:  any[] = [];

    let i = 0; // Initialize the counter
    for (const vaultKey in networkVaults) {
      const vault = networkVaults[vaultKey];
      // console.log("createDepositSwapVaultsArray vaultkey = ", vaultKey);

      depositSwapVaultsObject.push({
        id: i++, // Use the counter as the id
        tokenIcon: vault.tokens["Deposit erc20"].tokenIcon,
        ticker: vault.tokens["Deposit erc20"].ticker,
        tokenGreyed: false,
        available: vault.tokens["Stablecoin"].ticker, // Placeholder for current APRs
        stablecoin: vault.tokens["Stablecoin"].ticker,
        stablecoinIcon: vault.tokens["Stablecoin"].tokenIcon,
        stablecoinDecimals: vault.tokens["Stablecoin"].decimals,
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
        name: "Deposit erc20",
      });
    }
    // i = 0; // Initialize the counter
    for (const vaultKey in networkVaults) {
      const vault = networkVaults[vaultKey];
      // Add "Mortgage Synth" from the first vault only
      const firstVaultKey = Object.keys(networkVaults)[0];
      const firstVault = networkVaults[firstVaultKey];
      depositSwapVaultsObject.push({
        id: i++, // Increment the counter
        tokenIcon: firstVault.tokens["Mortgage Synth"].tokenIcon,
        ticker: firstVault.tokens["Mortgage Synth"].ticker,
        tokenGreyed: false,
        available: vaultKey, // Placeholder for current APRs
        stablecoin: firstVault.tokens["Stablecoin"].ticker,
        stablecoinIcon: firstVault.tokens["Mortgage Synth"].tokenIcon,
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
        name: "Mortgage Synth",
      });
    }

    $depositSwapVaults = depositSwapVaultsObject;
    console.log("depositSwapVaults =", $depositSwapVaults);
  }
  // Populate with depositable erc20a
  async function createBorrowVaultsArray() {
    const networkVaults = mortgageContractsInfo[Number($chainId)].vaults;
    const borrowVaultsObject: any[] = [];

    let i = 0; // Initialize the counter
    for (const vaultKey in networkVaults) {
      const vault = networkVaults[vaultKey];
      // console.log("createBorrowVaultsArray vaultkey = ", vaultKey);

      /// trigger viewFunction to get the available tokens

      let contract = mortgageContractsInfo[Number($chainId)].vaults[vaultKey].coreContracts["Mortgage Pool"].address;
      let depositErc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens["Deposit erc20"].decimals;
      
      let args = [];
      console.log("createBorrowVaultsArray run freeCoins, contract = ", contract, " args = ", args);
      let freeCoins = await runViewFunction({
          contractAddress: contract,
          abi: mortgagePoolContractAbi,
          functionName: 'freeCoins',
          args: [],
      }) as number[];

      console.log("createBorrowVaultsArray freeCoins = ", freeCoins);

      borrowVaultsObject.push({
        id: i, // Use the counter as the id
        tokenIcon: vault.tokens["Deposit erc20"].tokenIcon,
        ticker: vault.tokens["Deposit erc20"].ticker,
        tokenGreyed: false,
        // available: _round(fromWei(Number(freeCoins)[0], 18), 4) + " available |", // Placeholder for current APRs
        available: _round(fromWei(Number(freeCoins[0]), depositErc20Decimals), 6) + " available |", 
        stablecoinIcon: vault.tokens["Stablecoin"].tokenIcon,
        availableGreyed: true,
        repayInToken: "repay in " + vault.tokens["Stablecoin"].ticker,
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
      });

      i++; // Increment the counter
    }

    $borrowVaults = borrowVaultsObject;
    console.log("BorrowVaultsArray =", $borrowVaults);
  }

  async function createRedeemNFTArray() {
    const networkNFTs = $walletBalances[Number($chainId)].vaults;
    let redeemableNFTsArray: any[] = [];
    let counter=0;
    for (const vaultKey in networkNFTs) {
      const vault = networkNFTs[vaultKey];
      const conversionTickets = vault.nfts["Conversion vault Tickets"];

      if (
        conversionTickets &&
        conversionTickets.ownedIds &&
        conversionTickets.ownedIds.length > 0
      ) {
        for (const id of conversionTickets.ownedIds) {
          try {
            const depositErc20Decimals =
              mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens[
                "Deposit erc20"
              ].decimals;
            const pendingConversionData = await getPendingConversionData(
              id,
              vaultKey,
            );
            const exchangeRate = await updatePricePerCoin(vaultKey, false);
            const conversionSize = Number(pendingConversionData.conversionSize);
            //console.log("createRedeemNFTArray: conversionSize = ", conversionSize);
            const amountExpected = Number(exchangeRate) * conversionSize;
            //work out remaining time for loan
            const now = Math.floor(Date.now() / 1000);
            const expirationDate = Number(pendingConversionData.experationDate);
            let timeDifference = calculateDifferenceBetweenTimestamps(
              expirationDate,
              now,
            );
            const remainingtime = formatDuration(timeDifference);
            //console.log("createRedeemNFTArray2: conversionSize =", conversionSize);
            // const amountExpected = conversionSize.mul(exchangeRate);
            redeemableNFTsArray.push({
              id: counter,
              nftId: id,
              vaultName: vaultKey,
              tokenIcon:
                mortgageContractsInfo[Number($chainId)].vaults[vaultKey].nfts["Conversion vault Tickets"].tokenIcon,
              ticker:`${vaultKey}`+" NFT",
              tokenGreyed: false,
              stablecoin:mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens["Stablecoin"].ticker,
              available: "~$" + fromWei(conversionSize, depositErc20Decimals), // Replace with dynamic value if necessary
              availableGreyed: true,
              repayInToken: "",
              repayInTokenGreyed: true,
              feeNote: remainingtime,
              feeNoteGreyed: true,
              amountSold: fromWei(conversionSize, depositErc20Decimals),
              amountExpected:amountExpected, // Replace with dynamic value if necessary
              remainingTime: remainingtime,
              stablecoinDecimals: mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens["Stablecoin"].decimals
            });
            counter++;
          } catch (error) {
            console.error("Error processing NFT ID:", id, error);
            // Optionally, handle the error or continue to the next ID
          }
        }
      }
      
    }
    for (const vaultKey in networkNFTs) {
      const vault = networkNFTs[vaultKey];
      const conversionFeeTickets = vault.nfts["Conversion vault fee Tickets"];

      if (
        conversionFeeTickets &&
        conversionFeeTickets.ownedIds &&
        conversionFeeTickets.ownedIds.length > 0
      ) {
        for (const id of conversionFeeTickets.ownedIds) {
          try {
            const depositErc20Decimals =
              mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens[
                "Deposit erc20"
              ].decimals;
            const pendingConversionData = await getPendingConversionData(
              id,
              vaultKey,
            );
            console.log("createRedeemNFTArray: pendingConversionData =", pendingConversionData);
            const exchangeRate = await updatePricePerCoin(vaultKey, false);
            const conversionSize = Number(pendingConversionData.conversionSize);
            //console.log("createRedeemNFTArray: conversionSize =", conversionSize);
            const amountExpected =
              Number(exchangeRate) * conversionSize;

            //work out remaining time for loan
            const now = Math.floor(Date.now() / 1000);
            const expirationDate = Number(pendingConversionData.experationDate);
            let timeDifference = calculateDifferenceBetweenTimestamps(
              expirationDate,
              now,
            );
            const remainingtime = formatDuration(timeDifference);
            
            // const amountExpected = conversionSize.mul(exchangeRate);
            redeemableNFTsArray.push({
              id: counter,
              nftId: id,
              vaultName: vaultKey,
              tokenIcon:
                mortgageContractsInfo[Number($chainId)].vaults[vaultKey].nfts["Conversion vault fee Tickets"].tokenIcon,
              ticker:`${vaultKey}`+" FAV NFT",
              tokenGreyed: false,
              stablecoin:mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens["Stablecoin"].ticker,
              available: "~$" + fromWei(conversionSize, depositErc20Decimals), 
              availableGreyed: true,
              repayInToken: "",
              repayInTokenGreyed: true,
              feeNote: remainingtime,
              feeNoteGreyed: true,
              amountSold: fromWei(conversionSize, depositErc20Decimals),
              amountExpected: amountExpected, // Replace with dynamic value if necessary
              remainingTime: remainingtime,
              remainingTimeSeconds: timeDifference,
              stablecoinDecimals: mortgageContractsInfo[Number($chainId)].vaults[vaultKey].tokens["Stablecoin"].decimals,

            });
            counter++;
          } catch (error) {
            console.error("Error processing NFT ID:", id, error);
            // Optionally, handle the error or continue to the next ID
          }
        }
      }
      
    }
    
    $redeemableNFTs = redeemableNFTsArray;
    console.log("redeemableNFTs =", $redeemableNFTs);
  }


  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText($referralLink + $user);
      $copied = true;
      console.log($referralLink + $user);
      setTimeout(() => ($copied = false), 2000); // Message disappears after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Handle the error case here, maybe set an error message if needed
    }
  }



  async function loadFavUser() {
    console.log("Executing contract calls");
    
    $walletBalances = await getWalletBalances();
    console.log("walletBalances = ", $walletBalances);

    updateContractAddresses();
    // updatePricePerCoin($dropDownSelectionsNames.FAVSwapDepositVault);

    checkAllowances();
    //dashboard page
    createMyLoansArray();
    //FAV Borrow page
    createBorrowVaultsArray();
    //FAV Earn page
    createDepositVaultsArray();
    createExchangeDepositsVaultsArray();
    createRedeemableIOUsArray();
    getPreviewStatsForEarnDeposit();
    //FAV Swap page
    createDepositSwapVaultsArray();

    await createRedeemNFTArray();
    // System page
    createSystemLoans();
    updateAvailableToRedeem(0);
    updatePricePerCoin($dropDownSelectionsNames.FAVSwapDepositVault, false);
    updateExchangeRates();
  }

  /// End of Web 3 functions ------------------------------------------------

  function handleNav(event) {
    // Get the new page from the event detail
    const newPage = event.detail;

    currentPage.set(newPage);
  }

  onMount(() => {
    const unsubscribe = page.subscribe($page => {
        let pageName = ""; // Default to dashboard if no specific page is found
        const firstSegment = $page.url.pathname.split("/")[1].trim(); // Ensure to trim any spaces

        console.log("Current first segment:", firstSegment);
        
        switch (firstSegment) {
            case "borrow":
                pageName = "borrow";
                break;
            case "earn":
                pageName = "earn";
                break;
            case "convert":
                pageName = "convert";
                break;
            case "system":
                pageName = "system";
                break;
            case "docs":
                pageName = "docs";
                break;
            case "dashboard":
                pageName = "dashboard";
                break;
            case "":
                pageName = ""; // If you want to set a specific page name for the root, adjust here
                break;
            default:
                // Optional: handle unknown routes
        }
        
        currentPage.set(pageName); // Assuming currentPage is a writable store that controls the current page's state
    });

    // Call getSupportedNetworks if it's required for setting up network-specific logic
    getSupportedNetworks();

    return () => {
        unsubscribe(); // Clean up the subscription when the component is destroyed
    };
});



function handleClose() {
  $txProcessMessage = false;
}
</script>

<body>
  <div
    class="flex flex-col justify-between bg-offWhite-light dark:bg-offWhite-dark"
  >
    <Header on:navigate={handleNav} />

    <main
      class="p-5 mx-auto w-full h-full min-h-screen bg-offWhite-light dark:bg-offWhite-dark flex flex-col items-center justify-start"
    >
    <div class="w-200">
      {#if $txProcessMessage}
      <LineAnimation message="Please wait while your transaction is processed" on:close={handleClose} />
    {/if}

</div>
      <!-- referral link -->
      {#if showReferralLink}
      <div
        transition:slide
        class="referralLink {$roundedCornersSm} bg-whitePrim-light dark:bg-whitePrim-dark text-blackPrim-light dark:text-blackPrim-dark leftHandGroup mb-5 min-w-[200px] max-w-[600px] flex justify-center px-3 py-2 gap-x-1 items-center font-BarlowSemiBold xs:text-base text-xs"
      >
        <span>Earn FAV</span>
        <img
          class="w-5 h-5"
          src="/utilityTokens/FAV-token.svg"
          alt=""
          style="transform: rotate({$rotation}deg) scale({$scale});" />
        <span>tokens! </span>
        <span class="font-BarlowRegular">Share your referral</span>
    
        <button
          class="text-bluePrim-light bg-none font-BarlowBold"
          on:click={() => copyToClipboard()}
          >link
        </button>
        <div class="hidden xs:block">
          <Button
            cornerRadius={$roundedCornersSm}
            textColor={false}
            font={false}
            textSize="text-xs"
            border="border"
            borderColor={false}
            paddingX={false}
            paddingY="py-1.5"
            backgroundColor="bg-whitePrim-light dark:bg-whitePrim-dark"
            type={"button"}
          >
            <span>Learn more</span>
          </Button>
        </div>
        {#if $copied}
          <span transition:fade class="copiedMessage font-BarlowLight"
            >Copied!</span
          >
        {/if}
      </div>
    {/if}
    
    {#if !$account.address || !chains.some(chain => chain.id === $chainId)}
    <div class="bg-whitePrim-light p-4 text-center">
      Join the Fav Wave by connecting to one of our supported networks including:<br>
      {#each chains as chain}
        <div class="text-bluePrim-light text-base font-BarlowBold">{toTitleCase(chain.name)}</div> 
      {/each}  
      If you'd like to see FAV on your favourite chain join the deFiGarage <span class="text-orangePrim-light font-BarlowBold"><a href="https://discord.gg/FqBDBF99">discord</a></span> and let us know
    </div>
  {:else}
    <slot />
  {/if}
     
    </main>

    <footer class="bg-whitePrim-light dark:bg-whitePrim-dark py-5">
      <div class="flex justify-center items-center">
        <div class="text-xs text-center font-BarlowRegular text-blackPrim-light dark:text-blackPrim-dark">
          Made with care by
        </div>
        <div class="w-20">
            <a href="https://www.defigarage.dev">
                <!-- Light Mode Image -->
                <img src="/DeFiGarageLogos/DeFiGarageWordmarqueRev.svg" 
                alt="DeFiGarage Logo" 
                class="dark:hidden" />
                <!-- Dark Mode Image -->
                <img src="/DeFiGarageLogos/DeFiGarageWordmarque.svg" 
                alt="DeFiGarage Logo" 
                class="hidden dark:block" />
            </a>
        </div>
      </div>
    </footer>
  </div>
</body>

<style>
  main {
    min-height: calc(
      100vh - 120px - 50px
    ); /* 60px for header, 50px for footer */
  }
  body {
    @apply font-sans; /* This will use the default font defined in Tailwind config */
  }
</style>
