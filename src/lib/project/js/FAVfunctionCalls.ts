import { chainId, alchemyNode, user, providerNode } from "$lib/boilerplate/js/stores/wallet.ts";

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
    earnVaultSummary,
    exchangeRates,
    supportedNetworks,
    type NetworkInfo,
    type DepositVaultEntry,
    type MortgagePoolContractValues
    
} from "$lib/project/js/stores/projectDynamicValues.ts"

import {
    networkNameByChainId,
    alchemyNodeKeyByChainId,
    abbreviate,
  } from "$lib/boilerplate/js/core";

  import {
    triggerCdpsAppContractCalls
  } from "$lib/boilerplate/js/stores/wallet";

/// Project Web3 imports
// import { userBalance } from "$lib/project/js/stores/protocol";
import { BigNumber } from "bignumber.js";
/// Project Web3 imports
import { 
    transfer,
    runViewFunction,
    executeFunction,
    getSubStringAfterDash,
    getSubStringBeforeDash,
    updateContractAddresses,
    checkAllowances,
    findVaultIdentifierByIndex,
    updateCurrentSelectedDropdowns,
    toWei,
    fromWei,
    getWalletBalances,
    calculateDifferenceBetweenTimestamps,
    formatDuration,
    } from "$lib/project/js/helpers.ts";
    import { get } from 'svelte/store';
/// Boilerplate Web3 imports
import {  _round } from "$lib/boilerplate/js/core";

import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
import erc721Abi from "$lib/boilerplate/abi/erc-721.json"; 
import erc1155Abi from "$lib/boilerplate/abi/erc-1155.json";
import mortgageContractsAbi from "$lib/project/abi/mortgagecontracts.sol/mortgagecontracts.json";
import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
import mortgageTicketsAbi from "$lib/project/abi/mortgagetickets.sol/mortgagetickets.json";
import mortgageConversionVaultAbi from "$lib/project/abi/mortgageconversionvault.sol/mortgageconversionvault.json";
import mortgageFeeConversionVaultAbi from "$lib/project/abi/mortgagefeeconversionvault.sol/mortgagefeeconversionvault.json";




import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";

/// Transfer DAI from the connected user to the connected user 
export async function withdraw() {
    // console.log(user,userBalance[0]);
    let result = await transfer("dai",user,userBalance[0]);
        if (result){
            
            triggerCdpsAppContractCalls.set(false);
            triggerCdpsAppContractCalls.set(true);
        }
} 

export function getTVL(chain,){
    
    let tvl = 0;
    let _systemVaults=get(systemVaults);
    const _chainId = get(chainId);
    const _exchangeRates = get(exchangeRates);
    console.log("getTVL: _chainId = ", _chainId," _systemVaults = ", _systemVaults);
    
    if (!chain && _chainId != "0x0"){    
        for (const index of _systemVaults) {
            const erc20Decimals = mortgageContractsInfo[_chainId].vaults[index.vault].tokens["Deposit erc20"].decimals;
            const stablecoinDecimals = mortgageContractsInfo[_chainId].vaults[index.vault].tokens["Stablecoin"].decimals;
            let coinsInContracts = fromWei(index.coinsInContracts,erc20Decimals) ;
            let _exchangeRate = fromWei(_exchangeRates[index.vault].pricePerCoin, stablecoinDecimals)
            console.log("getTVL "+index.ticker +" coinsInContracts =", coinsInContracts);
            console.log("getTVL "+index.ticker +" exchangeRate =", fromWei(_exchangeRates[index.vault].pricePerCoin, stablecoinDecimals));
            let vaultTVL = Number(coinsInContracts)*Number(_exchangeRate);
            
            tvl += vaultTVL;
        }

    }  
    console.log("getTVL = ", tvl); 
    return tvl;
}

export function createExchangeDepositsVaultsArray() {
    let newExchangeDepositVaults: DepositVaultEntry[] = [];
    let i = 0; // Initialize the counter outside the loops
    let _walletBalances = get(walletBalances);

    // Iterate through each account (e.g., 0x89)
    Object.keys(_walletBalances).forEach(account => {
        const accountData = _walletBalances[account];

        // Iterate through each vault in the account
        Object.keys(accountData.vaults).forEach(vault => {
            const vaultData = accountData.vaults[vault];

            // Check if the vault has "Stablecoin" data
            if (vaultData.tokens && vaultData.tokens["Mortgage Pool"]) {
                const tokenData = vaultData.tokens["Mortgage Pool"];

                // Create an object for the newExchangeDepositVaults array
                const depositVaultEntry = {
                    ticker: tokenData.ticker,
                    balance: tokenData.balance,
                    rawBalance: tokenData.rawBalance,
                    tokenIcon: tokenData.tokenIcon || '/default-icon.svg',
                    vault: vault,
                    id: i++, // Increment the id for each token
                    available: tokenData.balance,
                    availableGreyed: true,
                    repayInToken: "",
                    repayInTokenGreyed: true,
                    tokenGreyed: false,
                    feeNote: "",
                    feeNoteGreyed: true
                };

                newExchangeDepositVaults.push(depositVaultEntry);
            }
        });
    });

    exchangeDepositVaults.set(newExchangeDepositVaults); // Update the Svelte store
    console.log("exchangeDepositVaults = ", get(exchangeDepositVaults));
}

export async function scrapeViewablelInfo(contractAddress, contractAbi, contractFunctions, contractValues, functions, nftId) {
    const _chainId = get(chainId);
    const _alchemyNode = get(alchemyNode);
    const _user = get(user);

    if (!contractAddress) {
        console.error("Address not found for the current contract.");
        return;
    }

    const _contractAddress = contractAddress;

    for (const functionName of functions) {
        if (!(functionName in contractFunctions.view)) {
            console.error(`Function '${functionName}' not found in contract.`);
            continue;
        }

        const functionObj = contractFunctions.view[functionName];
        contractValues[functionName] = {};
        let args: any[][] = [];

        // If nftId is provided, use it; otherwise, use the user's address
        const inputArg = nftId !== undefined ? nftId : _user;

        for (const key in functionObj) {
            if (key.startsWith("input")) {   
                contractValues[functionName][key] = functionObj[key];
            }
        }

        // Add the input argument
        args.push(inputArg);

        if (functionObj.hasOwnProperty('output')) {
            try {
                let result = await runViewFunction(_contractAddress, contractAbi, functionName, args);
                contractValues[functionName]['output'] = result;
            } catch (error) {
                console.error(`Error in function '${functionName}' with args ${args}: ${error}`);
                contractValues[functionName]['output'] = "Error"; // Set a default value or handle as needed
            }
        }
    }

    return contractValues;
}

export function getSupportedNetworks() {
    const mortgageContracts = mortgageContractsInfo;
    let _networkArray: NetworkInfo[] = [];
    let _supportedNetworkNames: string[] = [];
  
    for (const chainHex in mortgageContracts) {
      const networkInfo = mortgageContracts[chainHex];
      _networkArray.push({
        networkHex: chainHex,
        networkName: networkInfo.networkName
      });
      _supportedNetworkNames.push(networkInfo.networkName);
    }
  
    supportedNetworks.set(_networkArray);
    console.log("Supported networks = ", get(supportedNetworks));
  }



// Populate dashboard
export async function createMyLoansArray() {
    // const networkNFTs = $walletBalances[$chainId].vaults; ///-----
    let loanNFTsObject = {};

    // Initialize $mortgagePoolContractValues as an object
    mortgagePoolContractValues.set({});

    const balances = get(walletBalances);
    const currentChainId = get(chainId);
  
    for (const vaultKey in balances[currentChainId].vaults) {
      const vaultInfo = mortgageContractsInfo[currentChainId].vaults[vaultKey];
      const mortgageContractAddress = vaultInfo.coreContracts["Mortgage Pool"].address;
      const stablecoinTicker = vaultInfo.tokens["Stablecoin"].ticker;
      const stablecoinTokenIcon = vaultInfo.tokens["Stablecoin"].tokenIcon;
      const stablecoinDecimals = vaultInfo.tokens["Stablecoin"].decimals;
      const depositErc20Ticker = vaultInfo.tokens["Deposit erc20"].ticker;
      const depositErc20TokenIcon = vaultInfo.tokens["Deposit erc20"].tokenIcon;
  
      // Initializing each vaultKey in the store
      const initialVaultValue = {};
      mortgagePoolContractValues.update(values => {
        values[vaultKey] = initialVaultValue;
        return values;
      });
  
      loanNFTsObject[vaultKey] = [];
  
      for (const nftId of balances[currentChainId].vaults[vaultKey].nfts["Mortgage contracts"].ownedIds) {
        let functions = ["amountPayed", "baseSize", "coinSize", "expiration", "feeSize", "openDebt"];
  
        await scrapeViewablelInfo(
          mortgageContractAddress,
          mortgagePoolContractAbi,
          get(mortgagePoolContractFunctions),
          get(mortgagePoolContractValues)[vaultKey], 
          functions,
          nftId,
        );
  
        const contractValues = get(mortgagePoolContractValues);

        //work out remaining time for loan
        const now = Math.floor(Date.now() / 1000); // date and time now
        const loanExpirationDate = Number(
            contractValues[vaultKey].expiration.output,
        );
        // console.log("Now = ", now,  " ExpirationDate = ", loanExpirationDate);
        let timeDifference = calculateDifferenceBetweenTimestamps(
            loanExpirationDate,
            now,
        );
        const remainingterm = formatDuration(timeDifference);


        // calculate early repayment 
        const baseSize = Number(contractValues[vaultKey].baseSize.output);
        const amountPaid = Number(contractValues[vaultKey].amountPayed.output);
        const feeSize = Number(contractValues[vaultKey].feeSize.output);
        const earlyRepaymentFee = (baseSize - (amountPaid / (feeSize + baseSize) * baseSize)) * 0.1;
        const remainingBaseSize = (baseSize -(amountPaid / (feeSize + baseSize) * baseSize));
        const earlySettlementFigure = earlyRepaymentFee + remainingBaseSize;
        const remainingDebt = baseSize + feeSize - amountPaid;
        let tabState;
        if (remainingDebt > 0){
            tabState = "outstanding"
        }else{
            tabState = "finish"
        };


        const nftData = {
            id: nftId,
            vault: vaultKey,
            stablecoin: stablecoinTicker,
            stablecoinTokenIcon: stablecoinTokenIcon,
            depositErc20: depositErc20Ticker,
            depositErc20TokenIcon: depositErc20TokenIcon,
            loanSize: contractValues[vaultKey].coinSize.output,
            currentPaymentPending: fromWei(
            contractValues[vaultKey].openDebt.output[0],
            stablecoinDecimals,
            ),
            secondsTillLiquidation: contractValues[vaultKey].openDebt.output[2],
            remainingTerm: remainingterm,
            expiration: loanExpirationDate,
            amountPaid: contractValues[vaultKey].amountPayed.output,
            remainingDebt: fromWei(remainingDebt, stablecoinDecimals),
            baseSize: contractValues[vaultKey].baseSize.output,
            feeSize: contractValues[vaultKey].feeSize.output,
            tabState: tabState,
            isApproved: false,
            // feeRatio: feeRatio,
            remainingBaseSize: remainingBaseSize,
            earlyRepaymentFee: fromWei(earlyRepaymentFee, stablecoinDecimals),
            earlySettlementFigure: fromWei(earlySettlementFigure, stablecoinDecimals),
        };
        if (nftData.loanSize>0){
            loanNFTsObject[vaultKey].push(nftData);
        }
        
        }
    }

    loanNFTs.set(loanNFTsObject);
    console.log("loanNFTs =", get(loanNFTs));
}

/// FAV Swap page
// Populate with all system loans
export async function createSystemLoans() {
    const _chainId = get(chainId);
    const networkVaults = mortgageContractsInfo[_chainId].vaults;
    let _systemVaults: any[] = []; // Specify the type as any[]
    let _vaultLoans: any[] = []; // Specify the type as any[]
    console.log("createSystemLoans: _chainId = ", _chainId, " networkVaults = ", networkVaults);
  
    let counter = 0;
    for (const vaultKey in networkVaults) {
      const vault = networkVaults[vaultKey];
      // console.log("createSystemLoans vaultkey = ", vaultKey);
  
      /// trigger viewFunction to get the total supply fo that vault
  
      const mortgagePoolContract =
        mortgageContractsInfo[_chainId].vaults[vaultKey].coreContracts[
          "Mortgage Pool"
        ].address;
      const stablecoinTicker =
        mortgageContractsInfo[_chainId].vaults[vaultKey].tokens["Stablecoin"]
          .ticker;
      const depositErc20Ticker =
        mortgageContractsInfo[_chainId].vaults[vaultKey].tokens["Deposit erc20"]
          .ticker;
      const depositErc20Decimals =
        mortgageContractsInfo[_chainId].vaults[vaultKey].tokens["Deposit erc20"]
          .decimals;
      const mortgageContractsAddress =
        mortgageContractsInfo[_chainId].vaults[vaultKey].nfts[
          "Mortgage contracts"
        ].address;
      let coinsInContracts = 0;
      // get number oof loans
      let args = [];
      const vaultSupply = await runViewFunction(
        mortgageContractsAddress,
        mortgageContractsAbi,
        "totalSupply",
        args,
      );
      // console.log("vaultSupply = ", vaultSupply);
  
      let amountOfActiveLoans = 0;
      for (let i = 0; i < vaultSupply; i++) {
        // get number of loans
        let ownAddressArgs = [i];
        const ownerAddress = await runViewFunction(
          mortgageContractsAddress,
          mortgageContractsAbi,
          "ownerOf",
          ownAddressArgs,
        );
  
        // get size of loan
        let baseSizeArgs = [i];
        const baseSize = await runViewFunction(
          mortgagePoolContract,
          mortgagePoolContractAbi,
          "baseSize",
          baseSizeArgs,
        );
  
        // get size of loan
        let secondsTillArgs = [i];
        const openDebt = await runViewFunction(
          mortgagePoolContract,
          mortgagePoolContractAbi,
          "openDebt",
          secondsTillArgs,
        );
  
        // get coinsInContracts
        let coinsInContractsArgs = [];
        coinsInContracts = await runViewFunction(
          mortgagePoolContract,
          mortgagePoolContractAbi,
          "coinsInContracts",
          coinsInContractsArgs,
        );
  
        if (ownerAddress != "0x0000000000000000000000000000000000000000" && baseSize > 0) {
          amountOfActiveLoans++;
          _vaultLoans.push({
            id: i,
            baseSize:
              _round(fromWei(baseSize, depositErc20Decimals), 4) +
              " " +
              depositErc20Ticker,
            ownerAddress: ownerAddress,
            vault: vaultKey,
            secondsTillLiquidation: openDebt[2],
          });
        }
      }
  
      // assign vaults to systemVaults array
      _systemVaults.push({
        id: counter, // Use the counter as the id
        tokenIcon: vault.tokens["Deposit erc20"].tokenIcon,
        ticker: depositErc20Ticker,
        tokenGreyed: false,
        available: "(" + stablecoinTicker + ")", // Placeholder for current APRs
        stablecoinIcon: vault.tokens["Stablecoin"].tokenIcon,
        availableGreyed: true,
        repayInToken: amountOfActiveLoans,
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
        vault: vaultKey,
        coinsInContracts: coinsInContracts
      });
  
      counter++;
    }
  
    vaultLoans.set([...get(vaultLoans), ..._vaultLoans]); // Use get() to access the current value
    systemVaults.set([...get(systemVaults), ..._systemVaults]);
    console.log("vaultLoans = ", get(vaultLoans));
    console.log("systemVaults = ", get(systemVaults));
  }



















//-----------------------------------------------------------------------------------------------------------------
//Dashboard page------------------------------------------------------------------------------------------------------

// Pay current outstanding amount
export function payOutstanding() {
    console.log("payOutstanding called");

}

// Fully repay entire loan
export function fullyRepay() {
    console.log("fullyRepay called");

}


// Finish loan
export function finishLoan() {
    console.log("finishLoan called");

}

//-----------------------------------------------------------------------------------------------------------------
//Borrow page------------------------------------------------------------------------------------------------------

// Create loan contract
export function createLoan() {
    console.log("createLoan called");

}

//-----------------------------------------------------------------------------------------------------------------
//Earn page------------------------------------------------------------------------------------------------------

// Deposit ERC20 into FAV Earn
export function depositERC20() {
    console.log("depositERC20 called");

}

// Exchange FAV stables
export function exchangeFAVStables() {
    console.log("exchangeFAVStables called");

}


// Redeem IOU
export function redeemIOU() {
    console.log("redeemIOU called");

}


//-----------------------------------------------------------------------------------------------------------------
//Convert page------------------------------------------------------------------------------------------------------

// Swap ERC20 for stable backed NFT
export function swapERC20forNFT() {
    console.log("swapERC20forNFT called");

}

// Redeem selected NFT
export function redeemNFT() {
    console.log("redeemNFT called");

}

//-----------------------------------------------------------------------------------------------------------------
//System page------------------------------------------------------------------------------------------------------

// Default selected loan
export function defaultLoan() {
    console.log("defaultLoan called");

}

export function getShortestRemainingTime(nfts) {
    // Convert a time string to total minutes, treating past times as 0
    const timeToMinutes = (timeStr) => {
        // Check for negative values indicating past times
        if (timeStr.includes("-")) {
            return 0; // Past time, treat as 0 minutes
        }

        const daysMatch = timeStr.match(/(\d+)\s*days?/);
        const hoursMatch = timeStr.match(/(\d+)\s*h/);
        const minsMatch = timeStr.match(/(\d+)\s*m/);

        const days = daysMatch ? parseInt(daysMatch[1], 10) * 1440 : 0; // 1440 minutes in a day
        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) * 60 : 0; // 60 minutes in an hour
        const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;

        return days + hours + mins;
    };

    // Initialize an array to hold the total minutes for each NFT's remaining time
    const timesInMinutes = nfts.map(nft => timeToMinutes(nft.remainingTime));

    // Find the minimum time in minutes
    const minTimeInMinutes = Math.min(...timesInMinutes);

    // Convert the shortest time back to a string format ("x h x m")
    const hours = Math.floor(minTimeInMinutes / 60);
    const mins = minTimeInMinutes % 60;

    // Construct the shortest remaining time string
    let shortestTimeStr = "";
    if (hours > 0) shortestTimeStr += `${hours} h `;
    shortestTimeStr += `${mins} m`;

    return shortestTimeStr.trim();
}

// used for loan management on dashboard
export async function updateExchangeRates() {
    const _chainId = get(chainId); 
    const networkVaults = mortgageContractsInfo[_chainId].vaults;
    let _exchangeRates = {};

    // Populate exchange rates for vaults
    for (const vaultKey in networkVaults) {
        // Regular Vault processing
        await processVault(vaultKey, false);

        // "FAV " Vault processing
        await processVault(vaultKey, true);
    }

    // Update the store with the built _exchangeRates object
    exchangeRates.set(_exchangeRates);
    console.log("exchangeRates = ", get(exchangeRates));

    async function processVault(vaultKey, isFAVVault) {
        const contractKey = isFAVVault ? "Mortgage Fee Conversion Vault" : "Mortgage Conversion Vault";
        const vault = mortgageContractsInfo[_chainId].vaults[vaultKey];
        const mortgageConversionVault = vault.coreContracts[contractKey].address;
        const depositTokenDecimals = vault.tokens["Deposit erc20"].decimals;

        const totalSupply = await runViewFunction(mortgageConversionVault, mortgageConversionVaultAbi, "totalSupply", []);
        const previewRedeem = await runViewFunction(mortgageConversionVault, mortgageConversionVaultAbi, "previewRedeem", [totalSupply]);

        const pricePerCoin = calculatePricePerCoin(totalSupply, previewRedeem, depositTokenDecimals);
        const newVaultKey = isFAVVault ? `FAV ${vaultKey}` : vaultKey;

        _exchangeRates[newVaultKey] = { pricePerCoin };
    }

    function calculatePricePerCoin(totalSupply, previewRedeem, decimals) {
        const totalSupplyBN = new BigNumber(totalSupply);
        const previewRedeemBN = new BigNumber(previewRedeem);
        const factor = new BigNumber(10).pow(decimals);
        const pricePerCoin = previewRedeemBN.dividedBy(totalSupplyBN).multipliedBy(factor);
        return pricePerCoin.toFixed();
    }
}





export async function getPreviewStatsForEarnDeposit(){
    const _chainId = get(chainId);
    const _dropDownSelectionsNames = get(dropDownSelectionsNames);
    // get the mortgage and stablecoin contract addresses of the currently selected vault/dropdown
    const poolContract = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].coreContracts["Mortgage Pool"].address;
    const poolDecimals = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].coreContracts["Mortgage Pool"].decimals;
    const erc20 = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].tokens["Deposit erc20"].address;
    const erc20Decimals = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].tokens["Deposit erc20"].decimals;
    const stablecoin = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].tokens["Stablecoin"].address;
    const stablecoinDecimals = mortgageContractsInfo[_chainId].vaults[_dropDownSelectionsNames.FAVEarnDepositVault].tokens["Stablecoin"].decimals;


    console.log("getPreviewStatsForEarnDeposit contract = ", poolContract, "erc20Decimals = ", erc20Decimals );

    // get utilisation 
    const utilisationArgs = [0, 30];
    const utilisationResult = await runViewFunction(poolContract, mortgagePoolContractAbi, "simulateMonthlyPayment", utilisationArgs);


    const aprArgs = [];
    //console.log("getPreviewStatsForEarnDeposit: args", args);
    const aprResult = await runViewFunction(poolContract, mortgagePoolContractAbi, "calculateAPR", aprArgs);
    // console.log("simulate payments: ", result);
    const totalSupplyArgs = [];
    const totalSupply = await runViewFunction(poolContract, mortgagePoolContractAbi, "totalSupply", totalSupplyArgs);
    // console.log("Base price: ", erc20BasePrice);

    earnVaultSummary.set({
        poolUtilisation: utilisationResult[1],
        APR: aprResult,
        totalSupply: fromWei(totalSupply, poolDecimals),
    });

    console.log("loan summary info: ", get(earnVaultSummary));
    
    
}