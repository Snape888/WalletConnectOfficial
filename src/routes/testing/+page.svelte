<script>

    /// Svelte imports
    import { get } from 'svelte/store';
  
    
    /// Project Web3 imports
    import { 
      transfer,
      getNFTBalance,
      checkAllowances,
      executeFunction,
      runViewFunction,
      getWalletBalances,
      
    } from "$lib/project/js/helpers.ts";
  
    import {
      scrapeViewablelInfo
    } from "$lib/project/js/FAVfunctionCalls.ts";
  
    import { 
      user,
      chainId,
      userBalances,
      mortgagePoolContractFunctions,
      walletBalances,
      mortgagePoolContractValues,
      selectedFAVEarnDepositVault,
      dropDownSelectionsNames,
      depositSwapVaults,
      redeemableNFTs,
      dropDownSelections,
      contractAddresses,
      FAVLoanDepositAllowance,
      FAVEarnStablecoinDepositAllowance,
      FAVSwaperc20DepositAllowance,
      FAVLoanRepaymentsAllowance,
      loanManagementButtonLabels,
      payOutstandingAmount,
      finaliseLoanButtonLabel   
  
    } from '$lib/project/js/stores/projectDynamicValues.ts';
  
  
    import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
    import { account, provider, wagmiConfig} from "$lib/web3modal";
    
    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
    /// Boilerplate Web3 imports
    import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
    import { _round } from "$lib/boilerplate/js/core";
  
    import BigNumber from 'bignumber.js';
    
    
    /// Web3 functions ---------------------------------------------------------
  
  
  
    /// Show balances in console 
    async function executeRunViewFunction(contract, contractAbi, functionName, args) {
      // console.log("contract ="+ contract+" functionName = " + functionName + " args = " + args);
      let output = await runViewFunction(contract, contractAbi, functionName, args); 
      console.log("functionName= " + functionName + " value: "+ output);
    } 
  
    /// Show balances in console 
    function consoleLogBalances() {
      console.log($walletBalances);
      console.log("vault = "+ $walletBalances[$chainId].vaults[0]);
      console.log("Token balance = "+ $walletBalances[$chainId].vaults[0].tokens["Deposit erc20"].balance);
    } 
  
    function consoleLogMortgagePoolContract() {
      console.log($mortgagePoolContractFunctions);
      // console.log("Token balance = "+ $userBalances[$chainId]["erc20"]["masq"]["balance"]);
    } 
  
    function consoleLogMortgagePoolValues() {
      // scrapeViewablelInfo($contractAddresses.mortgagePoolAddress, mortgagePoolContractAbi, $mortgagePoolContractFunctions, $mortgagePoolContractValues);
      console.log($mortgagePoolContractValues);
      // console.log("Token balance = "+ $userBalances[$chainId]["erc20"]["masq"]["balance"]);
    } 
  
    
  
    async function consoleLogWalletBalances(){
      await getWalletBalances();
      console.log($walletBalances);
    }
  
  
    function consoleLogDepositSwapVaults(){
      console.log($depositSwapVaults[$dropDownSelectionsNames.FAVSwapDepositVault]["Deposit erc20"].ticker);
    }
  
    function consoleLogRedeemableNFTs(){
      console.log("$redeemableNFTs = ",$redeemableNFTs);
    }
  
  
    async function showTestInfo(){
      console.log("$dropDownSelectionsNames.FAVLoanBorrowVault = ", mortgageContractsInfo[Number($chainId)]);
      const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].coreContracts["Mortgage Pool"].address;
      const erc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].decimals;

      
        
      console.log("Account", $account)
  
      // console.log("Test info = ", "Balance "+ $walletBalances[$chainId]?.vaults[$dropDownSelectionsNames.FAVSwapDepositVault]?.tokens["Deposit erc20"]?.balance ?? 'Loading...');
      // console.log("Keys:", Object.keys($redeemableNFTs))
      // console.log("Test info = ", $redeemableNFTs[$dropDownSelectionsNames.FAVSwapRedeemableNFTs][selectedRedemptionNFT].ticker);
  
    }
  
    let selectedRedemptionNFT = 0;
  
    /// End of Web 3 functions ------------------------------------------------
  
  </script>
  
  
    
    <div id=pageContent class="flex flex-col justify-center items-center space-y-5 w-full bg-slate-500">
      <a href="/App">Go to the APP page</a>
      <div>FAV Stable Balance: {$walletBalances[$chainId]?.vaults[$dropDownSelectionsNames.FAVEarnDepositVault]?.tokens["Mortgage Pool"]?.balance ?? 'Loading...'}</div>
      <div>Mortgage Tickets Balance: {$walletBalances[$chainId]?.vaults["AWMATIC-DAI"]?.nfts["Mortgage Tickets"]?.balance ?? 'Loading...'}</div>
      <div>Mortgage Tickets IDs: {$walletBalances[$chainId]?.vaults["AWMATIC-DAI"]?.nfts["Mortgage Tickets"]?.ownedIds ?? 'Loading...'}</div>
  

  
      <button on:click={() => consoleLogBalances()}>
        Console log balances
      </button>
  
      <button on:click={() => consoleLogWalletBalances()}>
        Console log wallet balances
      </button>
  
      <button on:click={() => consoleLogMortgagePoolContract()}>
        Console log mortagePool contract reference structure
      </button>
  
      <button on:click={() => consoleLogMortgagePoolValues()}>
        Console log mortagePool view values
      </button>
  
      <button on:click={() => consoleLogDepositSwapVaults()}>
        Console log $depositSwapVaults
      </button>
  
      <button on:click={() => consoleLogRedeemableNFTs()}>
        Console log $redeemableNFTs
      </button>
  
      <button on:click={() => executeRunViewFunction("0x0f1134D8ed24F9eb75F8D0deaDfDe1a05b35032F", mortgagePoolContractAbi, "balanceOf", ["0x33bF12C0F76AEf7bb292B6862E5c431c1Beda79E"])}>
        Run view function
      </button>
  
      <button on:click={() => executeRunViewFunction("0x0f1134D8ed24F9eb75F8D0deaDfDe1a05b35032F", mortgagePoolContractAbi, "balanceOf", ["0x33bF12C0F76AEf7bb292B6862E5c431c1Beda79E"])}>
        Check stablecoin allowance for mortgage pool
      </button>
  
      <button on:click={() => showTestInfo()}>
        Show test info
      </button>
  
  
  
  
    </div>
  
  
    
  