import { ALCHEMY_NODE_KEY_ETHEREUM_MAINNET, ALCHEMY_NODE_KEY_POLYGON_MAINNET } from "$lib/boilerplate/js/env.ts";

import { account, provider, wagmiConfig} from "../../web3modal.ts"
import { sendTransaction } from '@wagmi/core';
import toast from 'svelte-french-toast';
import { JsonRpcProvider } from '@ethersproject/providers';
import { readContract } from '@wagmi/core'

import { content, visibility } from "$lib/boilerplate/js/stores/alert.ts";
import { mortgageContractsInfo } from "$lib/project/js/contractAddresses.ts";

import { _round, networkNameByChainId, alchemyNodeKeyByChainId } from '$lib/boilerplate/js/core';

import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
import erc721Abi from "$lib/boilerplate/abi/erc-721.json"; 
import erc1155Abi from "$lib/boilerplate/abi/erc-1155.json";
import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
import mortgageTicketsAbi from "$lib/project/abi/mortgagetickets.sol/mortgagetickets.json";
import mortgageConversionVaultAbi from "$lib/project/abi/mortgageconversionvault.sol/mortgageconversionvault.json";
import mortgageFeeConversionVaultAbi from "$lib/project/abi/mortgagefeeconversionvault.sol/mortgagefeeconversionvault.json";


import { BigNumber } from "bignumber.js";

import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";

import { 
    user,
    chainId,
    providerNode,
    loanNFTs,
    userBalances,
    mortgagePoolContractFunctions,
    walletBalances,
    dropDownSelections,
    dropDownSelectionsNames,
    FAVLoanDepositAllowance,
    FAVLoanRepaymentsAllowance,
    FAVEarnStablecoinDepositAllowance,
    FAVSwaperc20DepositAllowance,
    nftRemovalAllowances,
    contractAddresses,
    pricePerCoin,
    availableToRedeem,
    redeemableNFTs,
    loanManagementButtonLabels,
    payOutstandingAmount,
    finaliseLoanButtonLabel,
    txProcessMessage
} from '$lib/project/js/stores/projectDynamicValues.ts';


import { get } from 'svelte/store';



export function abbreviate(word, before, after) {
    word = word.substr(0, before) + "..." + word.substr(word.length - after);
    return word;
}

export const uint256 = "65792089237316195423570985008687907853269984665640564039457584007913129639935";

export const socketByChainId = {139: "wss://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_NODE_KEY_ETHEREUM_MAINNET};





// export async function runViewFunction(contract, contractAbi, functionName, args) {
//     try {
//         // console.log("contract ="+ contract+" functionName = " + functionName + " args = " + args);
//         const _chainId = get(chainId);
//         const _alchemyNode: any = alchemyNodeKeyByChainId[_chainId];
//         const contractObject = new _alchemyNode.eth.Contract(contractAbi, contract);
//         return await contractObject.methods[functionName](...args).call();
//     } catch (error) {
//         console.error(`Error in runViewFunction whilst executing:, ${functionName}, ${(error as Error).message}`);
//         return "Error"; // Return an error indicator or specific object
//     }
// }

export async function runViewFunction({ contractAddress, abi, functionName, args }) {
    
    try {
    //console.log("runViewFunction: contractAddress = ", contractAddress," abi = ", abi," functionName = ", functionName," args = ", args);
    const result = await readContract(wagmiConfig, {
        address: contractAddress, // The contract address
        abi: abi, // The contract ABI
        functionName: functionName, // The function name to call
        args: args, // Arguments to the function call
    });
        //console.log("runViewFunction: result = ", result);
        return result;
    } catch (error) {
        console.error(`Error in runViewFunction whilst executing ${functionName}:`, (error as Error).message);
        return "Error"; // Return an error indicator or specific object
    }
}

export async function getWalletBalances() {

    const _chainId = get(chainId);
    // console.log("getWalletBalances chainId = ", _chainId);
    // console.log("getWalletBalances alchemyNodechainId = ", alchemyNodeKeyByChainId);
    const _user = get(user);
    const tempWalletBalances = get(walletBalances);   

    // Constants for item types
    const nfts = "nfts";
    const tokens = "tokens";

    // Initialize walletBalances
    // let tempWalletBalances = {};

    if (!_chainId) {
        console.error("Network information not found for the current network.");
        return;
    }

    // Ensure the _chainId structure exists in walletBalances
    tempWalletBalances[Number(_chainId)] = { vaults: {} };

    try {
        for (const vaultName in mortgageContractsInfo[Number(_chainId)]["vaults"]) {

            // get mortgagePool contract and add to tokens
            // Initialize vault structure within walletBalances
            tempWalletBalances[Number(_chainId)]["vaults"][vaultName] = { tokens: {}, nfts: {} };
            console.log("getWalletBalances enter vault loop");
            const vaultInfo = mortgageContractsInfo[Number(_chainId)]["vaults"][vaultName];
            // Loop through tokens
            if (vaultInfo[tokens]) {
                for (const tokenKey in vaultInfo[tokens]) {
                const tokenInfo = vaultInfo[tokens][tokenKey];
                try {
                    // console.log("Sending to runViewFunction: tokenInfo.address = ", tokenInfo.address," erc20Abi = ", erc20Abi ," [_user] = ", [_user]);
                    const balanceBigNumber = await runViewFunction({
                    contractAddress: tokenInfo.address,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [_user]
                    });
                    const balance = fromWei(Number(balanceBigNumber), tokenInfo.decimals);
                    // Update the balance in your tempWalletBalances structure
                    tempWalletBalances[Number(_chainId)]["vaults"][vaultName]["tokens"][tokenKey] = {
                        balance: _round(balance, 5),
                        rawBalance: balanceBigNumber,
                        tokenIcon: tokenInfo.tokenIcon || '/default-icon.svg', // Default icon if not provided
                        ticker: tokenInfo.ticker || 'Unknown' // Default ticker if not provided
                    };
                    
                } catch (error) {
                    console.error(`Error fetching balance for token ${tokenKey}: ${error}`);
                }
                }
            }
            if (vaultInfo[nfts]) {
                for (const nftKey in vaultInfo[nfts]) {
                    // console.log("getWalletBalances enter nft loop in vaults, curent nft = ",nftKey);
                    const nftInfo = vaultInfo[nfts][nftKey];
                    // console.log("NFT found:", nftKey);
                    // console.log("Sending to runViewFunction: tokenInfo.address = ", nftInfo.address," erc20Abi = ", erc721Abi ," [_user] = ", [_user]);
                    // Use the new runViewFunction to get the balance
                    const balanceString = await runViewFunction({
                    contractAddress: nftInfo.address,
                    abi: erc721Abi,
                    functionName: 'balanceOf',
                    args: [_user]
                    });
                    //const balanceString = await getNFTBalance(_alchemyNode, nftInfo.address, _user);
                    let balanceNumber = Number(balanceString);
                    // console.log("User has "+balanceNumber+ " "+nftInfo.address+ nftInfo.address+ " NFTs in " +vaultName+ " vault");
                    //let ownedIds = balanceNumber > 0 ? await getOwnedNFTIds(_alchemyNode, nftInfo.address, _user, balanceNumber) : [];
                    let ownedIds: number[] = [];
                    for (let index = 0; index < balanceNumber; index++) {
                        let tokenId = await runViewFunction({
                            contractAddress: nftInfo.address,
                            abi: erc721Abi,
                            functionName: 'tokenOfOwnerByIndex',
                            args: [ _user, index]
                        });
                        ownedIds.push(Number(tokenId));
                        
                    }
                


                    tempWalletBalances[Number(_chainId)]["vaults"][vaultName]["nfts"][nftKey] = {
                        balance: balanceString,
                        ownedIds: ownedIds
                    };
                }
            }
            const mortgagePoolTicker = mortgageContractsInfo[Number(_chainId)].vaults[vaultName].coreContracts["Mortgage Pool"].ticker;
            const mortgagePoolTokenIcon = mortgageContractsInfo[Number(_chainId)].vaults[vaultName].coreContracts["Mortgage Pool"].tokenIcon;
            const mortgagePoolDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vaultName].coreContracts["Mortgage Pool"].decimals;
            const mortgagePoolAddress = mortgageContractsInfo[Number(_chainId)].vaults[vaultName].coreContracts["Mortgage Pool"].address;
            // console.log("getWalletBalances: mortgagePoolTicker = ", mortgagePoolTicker," mortgagePoolTokenIcon = ", mortgagePoolTokenIcon, " mortgagePoolDecimals = ", mortgagePoolDecimals," mortgagePoolAddress = ", mortgagePoolAddress);
            // const tokenObject = new _alchemyNode.eth.Contract(erc20Abi, mortgagePoolAddress);
            // const tokenObject = new ethers.Contract(mortgagePoolAddress, erc20Abi, _alchemyNode);
            // const balance = new BigNumber(await tokenObject.balanceOf(_user));
            let balance = await runViewFunction({
                contractAddress: mortgagePoolAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [ _user]
            });
            console.log("getWalletBalances: balance = ", balance);
            // const balance = new BigNumber(await tokenObject.methods.balanceOf(_user).call());
            const balanceString = fromWei(balance, mortgagePoolDecimals);

            tempWalletBalances[Number(_chainId)]["vaults"][vaultName]["tokens"]["Mortgage Pool"] = {
                balance: _round(balanceString, 5),
                rawBalance: balance,
                tokenIcon: mortgagePoolTokenIcon || '/default-icon.svg', // Default icon if not provided
                ticker: mortgagePoolTicker || 'Unknown' // Default ticker if not provided
            };
        }
    } catch (error) {
        console.error("Error occurred - getWalletBalances:", error);
    }
    
    return tempWalletBalances;

}


export async function getNFTBalance(alchemyNode, nftContractAddress, ownerAddress) {
    try {
        //console.log("NFT Contract Address:", nftContractAddress);
        //console.log("Owner Address:", ownerAddress);

        const tokenObject = new alchemyNode.eth.Contract(erc721Abi, nftContractAddress);
        let balance = await tokenObject.methods.balanceOf(ownerAddress).call();
        
        let balanceString = balance.toString(); // Convert to string
        //console.log("Balance:", balanceString); // Log the string representation
        return balanceString;
    } catch (error) {
        console.error("Error fetching NFT balance:", error);
        return "Error";
    }
}

export async function getOwnedNFTIds(alchemyNode, nftContractAddress, ownerAddress, balance) {
    try {
        const tokenObject = new alchemyNode.eth.Contract(erc721Abi, nftContractAddress);
        let ownedIds: string[] = []; // Update the type to string[]

        for (let index = 0; index < balance; index++) {
            let tokenId: string = await tokenObject.methods.tokenOfOwnerByIndex(ownerAddress, index).call();
            ownedIds.push(tokenId.toString());
        }

        // console.log("Owned IDs:", ownedIds);
        return ownedIds;
    } catch (error) {
        console.error("Error fetching owned NFT IDs:", error);
        return [];
    }
}

export async function updateManagementButtons(inputAmount, vault, loanId) {
    if (isNaN(inputAmount)) {
        console.error('Invalid input amount');
        return;
    }

    // Fetch the isApproved status from loanNFTs
    const loanNfts = get(loanNFTs)[vault];
    const loan = loanNfts ? loanNfts.find(l => l.id === loanId) : null;
    console.log("updateManagementButtons: loanNFTs[vault][loan] =",loan);
    console.log("updateManagementButtons: isApproved =",loan.isApproved );
    const isApproved = loan ? loan.isApproved : false;

    // Update finaliseLoanButtonLabel using the correct method
    finaliseLoanButtonLabel.update(labels => {
        if (!labels[vault]) labels[vault] = {};
        labels[vault][loanId] = isApproved ? "Finalise" : "Approve";
        console.log("updateManagementButtons: labels[vault][loanId] = ", labels[vault][loanId]);
        return labels;
    });

    // Convert the input amount to BigNumber for accurate comparison
    inputAmount = new BigNumber(inputAmount);

    // Retrieve the current allowance from the FAVLoanRepaymentsAllowance store.
    const currentAllowanceArray = get(FAVLoanRepaymentsAllowance)[vault];
    const currentAllowance = new BigNumber(currentAllowanceArray && currentAllowanceArray.length > 0 ? currentAllowanceArray[0] : '0');

    // Determine if the transaction needs approval
    const payOutstandingNeedsApproval = inputAmount.isGreaterThan(currentAllowance);
    const fullyRepayNeedsApproval = new BigNumber(loan.earlySettlementFigure).isGreaterThan(currentAllowance);


    // Update the labels based on whether approval is needed
    loanManagementButtonLabels.update(labels => {
        if (!labels[vault]) labels[vault] = {};
        labels[vault][loanId] = {
            payOutstanding: payOutstandingNeedsApproval ? "Approve" : "Pay",
            fullyRepay: fullyRepayNeedsApproval ? "Approve" : "Fully repay"
        };
        return labels;
    });

    // Update payOutstandingAmount
    payOutstandingAmount.update(amounts => {
        if (!amounts[vault]) amounts[vault] = {};
        amounts[vault][loanId] = inputAmount.toString();
        return amounts;
    });

    

}

// export async function executeFunction(contractAddress, contractAbi, functionName, args) {
//     let _hash;
//         try {
//             console.log("Execute function. contractAddress ="+ contractAddress+" functionName = " + functionName + " args = " + args);
//             const gasPrice = await getGasPrice(); 
//             const providerNode = await getProviderNode();
//             const signer = providerNode.getSigner();
//             const chainId = await getChainId();
//             const userBalances = await getUserBalances();
//             const mortgagePoolContract = await getMortgagePoolContract();
//             const user = await getUser();

//             const contractObject = new ethers.Contract(contractAddress, contractAbi, signer); 
//             // Dynamically estimate gas for the specified function with given arguments
//             const gasLimit = await contractObject.estimateGas[functionName](...args);
//             const txResponse = await contractObject[functionName](...args, {
//                 gasLimit: gasLimit,
//                 gasPrice: gasPrice
//             });
//             // console.log(txResponse.hash);
//             _hash = txResponse.hash;
//             txProcessMessage.set(true);
//             const txReceipt = await txResponse.wait();
//             // console.log(txReceipt);
//             return true            
//         }
//         catch (error) {
//             console.log(error);
//             txProcessMessage.set(false);
//             return false
//         }
// }

export async function executeFunction(contractAddress, contractAbi, functionName, args) {
    if (!get(account).address) throw Error('Wallet disconnected');
    console.log("Execute transaction: contractAddress = ", contractAddress," contractAbi = ", contractAbi," functionName = ", functionName," args = ", args);
    // Assuming args can be directly used with the function
    // Note: This example assumes the contract method is payable if it requires value
    const encodedData = new ethers.Interface(contractAbi).encodeFunctionData(functionName, args);

    try {
        const transactionHash = await sendTransaction(wagmiConfig, {
            to: contractAddress,
            // Add value if your function is payable
            // value: ethers.utils.parseEther('0.1'), // Example value
            data: encodedData as `0x${string}`, // Type assertion to satisfy the expected type
        });

        txProcessMessage.set(true);

        if (transactionHash) {
            console.log('Transaction sent. Hash:', transactionHash);
            toast.success('Transaction sent. Waiting for confirmation...');

            // Wait for the transaction to be mined and get the transaction receipt
            const provider = new ethers.BrowserProvider(window.ethereum);
            const transactionReceipt = await provider.waitForTransaction(transactionHash);
            

            if (transactionReceipt && transactionReceipt.status === 1) {
                console.log('Transaction confirmed. Receipt:', transactionReceipt);
                toast.success('Transaction successful');
                txProcessMessage.set(false);
                return true;
            } else {
                console.error('Transaction failed. Receipt:', transactionReceipt);
                toast.error('Transaction failed');
                txProcessMessage.set(false);
                return false;
            }
        } else {
            console.error('Transaction failed. No transaction hash.');
            toast.error('Transaction failed');
            txProcessMessage.set(false);
            return false;
        }
    } catch (error) {
        console.error('Transaction error:', error);
        toast.error('Transaction execution failed');
        txProcessMessage.set(false);
        return false;
    }
}

async function waitForTransactionCompletion(txHash) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const receipt = await provider.waitForTransaction(txHash);
      if (receipt && receipt.status === 1) {
        console.log('Transaction confirmed:', receipt);
        // Handle successful transaction confirmation
      } else {
        console.error('Transaction failed:', receipt);
        // Handle transaction failure
      }
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      // Handle errors
    }
  }

// Reactive statement to get the mortgage pool address
// $: mortgagePoolAddress = initiateContractAddresses();

export async function updateContractAddresses() {

    const _chainId = get(chainId);
    const _contractAddresses = get(contractAddresses);

    updateCurrentSelectedDropdowns();    

    const _dropDownSelectionsNames = get(dropDownSelectionsNames);
    // const currentBorrowVault = _dropDownSelectionsNames.FAVLoanBorrowVault;
    const currentBorrowVault = _dropDownSelectionsNames.FAVLoanBorrowVault;
    const currentEarnVault = _dropDownSelectionsNames.FAVEarnDepositVault;
    const currentSwapVault = _dropDownSelectionsNames.FAVSwapDepositVault;
    

    _contractAddresses.mortgagePoolAddress = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].coreContracts["Mortgage Pool"].address;
    _contractAddresses.stablecoinAddress = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].tokens["Stablecoin"].address;
    _contractAddresses.stablecoinDecimals = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].tokens["Stablecoin"].decimals;
    _contractAddresses.depositErc20Address = mortgageContractsInfo[Number(_chainId)].vaults[currentSwapVault].tokens["Deposit erc20"].address;
    _contractAddresses.depositErc20Decimals = mortgageContractsInfo[Number(_chainId)].vaults[currentSwapVault].tokens["Deposit erc20"].decimals;
    _contractAddresses.borrowErc20Address = mortgageContractsInfo[Number(_chainId)].vaults[currentBorrowVault].tokens["Deposit erc20"].address;
    _contractAddresses.borrowErc20Decimals = mortgageContractsInfo[Number(_chainId)].vaults[currentBorrowVault].tokens["Deposit erc20"].decimals;
    _contractAddresses.favStableAddress = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].coreContracts["Mortgage Pool"].address;
    _contractAddresses.favStableDecimals = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].coreContracts["Mortgage Pool"].decimals;
    _contractAddresses.mortgageConversionVaultAddress = mortgageContractsInfo[Number(_chainId)].vaults[currentEarnVault].coreContracts["Mortgage Conversion Vault"].address;

    // Log updated addresses for debugging
    // console.log("Updated contract addresses:", _contractAddresses);

    // Set the store with the updated object
    contractAddresses.set(_contractAddresses);
    // console.log("Current contract addresses:", get(contractAddresses));
    
}

export function updateCurrentSelectedDropdowns(){
    getDropDownSelectionsNames();

    const _chainId = get(chainId);
    const _dropDownSelections = get(dropDownSelections);
 
    // FAV Loans
    const currentLoansVault = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVLoanBorrowVault) || "";
    // FAV Earn
    const currentEarnVault = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVEarnDepositVault) || "";
    const currentEarnExchangeStable = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVEarnExchangeStable) || "";
    const FAVEarnRedeemIOU = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVEarnRedeemIOU) || "";
    // FAV Swap
    const currentSwapVault = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVSwapDepositVault) || "";
    const currentRedemptionNFT = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVSwapRedeemableNFTs) || "";
    // FAV System
    const currentSystemLoanVault = findVaultIdentifierByIndex(mortgageContractsInfo, _chainId, _dropDownSelections.FAVSystemLoanVault) || "";
    // Dashboard Loans
    const currentDashboardLoans = _dropDownSelections.DashboardLoans || [];

    // Set the new values directly on the store
    dropDownSelectionsNames.set({
        // FAV Loans
        FAVLoanBorrowVault: currentLoansVault,
        // FAV Earn
        FAVEarnDepositVault: currentEarnVault,
        FAVEarnExchangeStable: currentEarnExchangeStable,
        FAVEarnRedeemIOU: FAVEarnRedeemIOU,
        // FAV Swap        
        FAVSwapDepositVault: currentSwapVault,
        FAVSwapRedeemableNFTs: currentRedemptionNFT,
        // FAV System
        FAVSystemLoanVault: currentSystemLoanVault,
        // Dashboard Loans
        DashboardLoans: currentDashboardLoans
    });

    // console.log("Dropdown names updated:", get(dropDownSelectionsNames));
}


export async function checkAllowances(){
    
    /// Allowance function requires, input1: userAddress, input2: spenderAddress
    const _chainId = get(chainId);
    const _user = get(user);
    const _dropdownSelectionNames = get(dropDownSelectionsNames);
    const _dropdownSelections = get(dropDownSelections);
    const _contractAddresses = get(contractAddresses);


    // Dashboard FAV Loans repayment allowances   
    let _FAVLoanRepaymentsAllowance = ({});
    for (const vault of Object.keys(mortgageContractsInfo[Number(_chainId)].vaults)) {
        console.log("Checking allowances for vault:", vault);
        const stablecoinAddress = mortgageContractsInfo[Number(_chainId)].vaults[vault].tokens["Stablecoin"].address;
        const stablecoinDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vault].tokens["Stablecoin"].decimals;
        const mortgagePoolAddress = mortgageContractsInfo[Number(_chainId)].vaults[vault].coreContracts["Mortgage Pool"].address;
        
        const favLoansRepaymentArgs = [_user, mortgagePoolAddress];
        
        // Assuming runViewFunction is an async function
        console.log("checkAllowances: stablecoinAddress = ",stablecoinAddress, " erc20Abi = ", erc20Abi, " favLoansRepaymentArgs = ", favLoansRepaymentArgs );
        //const allowance = await runViewFunction(stablecoinAddress, erc20Abi, "allowance", favLoansRepaymentArgs);
        let allowance = await runViewFunction({
            contractAddress: stablecoinAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: favLoansRepaymentArgs,
        });
        _FAVLoanRepaymentsAllowance[vault] = [fromWei(allowance, stablecoinDecimals)];
        FAVLoanRepaymentsAllowance.set(_FAVLoanRepaymentsAllowance)
        console.log("FAVLoanRepaymentsAllowance = ", get(FAVLoanRepaymentsAllowance));
    }
    
    // FAV Loans allowances - mortgagePool to move erc20 (Create loan user deposit)
    const _FAVLoansMortgagePoolAddress = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVLoanBorrowVault].coreContracts["Mortgage Pool"].address;// get the mortgage address for the current selected dropdown/vault on the FAV Loans page
    const _FAVLoansErc20Address = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVLoanBorrowVault].tokens["Deposit erc20"].address;// get the erc20 token address for the current selected dropdown/vault on the FAV Loans page
    const favLoansArgs =[_user, _FAVLoansMortgagePoolAddress];
    let _FAVLoanDepositAllowance = await runViewFunction({
        contractAddress: _FAVLoansErc20Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: favLoansArgs,
    });
    // ----------------------------------------------------------------------------------
 
    // FAV Earn allowances - mortgagePool to move stable (FAV Earn stablecoin deposit)
    const _FAVEarnMortgagePoolAddress = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVEarnDepositVault].coreContracts["Mortgage Pool"].address;// get the mortgage address for the current selected deposit dropdown on the FAV Earn page
    const _FAVEarnStable20Address = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVEarnDepositVault].tokens["Stablecoin"].address;// get the erc20 token address for the current selected dropdown/vault on the FAV Loans page
    const favEarnArgs =[_user, _FAVEarnMortgagePoolAddress];
    //console.log("FAVEarnStablecoinDepositAllowance = _dropdownSelectionNames.FAVEarnDepositVault", _dropdownSelectionNames.FAVEarnDepositVault);
    //console.log("FAVEarnStablecoinDepositAllowance = contract:", _FAVEarnStable20Address, " favEarnArgs: ", favEarnArgs);
    let _FAVEarnStablecoinDepositAllowance = await runViewFunction({
        contractAddress: _FAVEarnStable20Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: favEarnArgs,
    });
    console.log("FAVEarnStablecoinDepositAllowance = ", _FAVEarnStablecoinDepositAllowance);
    // ----------------------------------------------------------------------------------

    // FAV Swap allowances - mortgage conversion vault to move erc20 (FAV Swap erc20 deposit)
    // check if FAV token is being swapped
    let _FAVSwapMortgageConversionAddress;
    let _FAVSwapDepositErc20Address;
    let favSwapArgs;
    let _FAVSwaperc20DepositAllowance;
    let contractName;
    let convertAbi;
    let swapToken; 

    if(_dropdownSelections.FAVSwapDepositVault > (Object.keys(mortgageContractsInfo[Number(_chainId)]?.vaults).length-1)){
        console.log("checkAllowances FAV token swap detected");
        // const vaultChild = coreContracts;
        contractName = "Mortgage Fee Conversion Vault";
        swapToken = "Mortgage Synth";
        convertAbi = mortgageConversionVaultAbi;
    }else{
        console.log("checkAllowances FAV token swap NOT detected");
        // const vaultChild = tokens;
        contractName = "Mortgage Conversion Vault";
        swapToken = "Deposit erc20";
        convertAbi = mortgageFeeConversionVaultAbi;
    }

    _FAVSwapMortgageConversionAddress = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVSwapDepositVault].coreContracts[contractName].address;// get the mortgage address for the current selected erc20 deposit dropdown on the FAV Swap page
    _FAVSwapDepositErc20Address = mortgageContractsInfo[Number(_chainId)].vaults[_dropdownSelectionNames.FAVSwapDepositVault].tokens[swapToken].address;// get the erc20 token address for the current selected dropdown/vault on the FAV Loans page
    favSwapArgs =[_user, _FAVSwapMortgageConversionAddress];
    _FAVSwaperc20DepositAllowance = await runViewFunction({
        contractAddress: _FAVSwapDepositErc20Address,
        abi: convertAbi,
        functionName: 'allowance',
        args: favSwapArgs,
    });
    console.log("FAVSwaperc20DepositAllowance = ", _FAVSwaperc20DepositAllowance);

    //--------------------------------------------------------------------------------------

    /// update  allowances
    updateContractAddresses();
    //FAV Loans
    FAVLoanDepositAllowance.set(fromWei(_FAVLoanDepositAllowance,_contractAddresses.borrowErc20Decimals));
    //FAV Earn
    FAVEarnStablecoinDepositAllowance.set(fromWei(_FAVEarnStablecoinDepositAllowance,_contractAddresses.stablecoinDecimals));
    // FAV Swap
    FAVSwaperc20DepositAllowance.set(fromWei(_FAVSwaperc20DepositAllowance, _contractAddresses.depositErc20Decimals));

    console.log("CheckAllowances complete");
}


export async function checkNFTAllowance(loanVault, loanId) {
    const _chainId = get(chainId);
    const mortgageTicketsContract = mortgageContractsInfo[Number(_chainId)].vaults[loanVault].nfts["Mortgage contracts"].address;
    const mortgagePoolContract = mortgageContractsInfo[Number(_chainId)].vaults[loanVault].coreContracts["Mortgage Pool"].address;

    console.log("checkNFTAllowance loanId = ", loanId, " loanVault = ", loanVault);

    let args = [loanId];
    let result = await runViewFunction({
        contractAddress: mortgageTicketsContract,
        abi: mortgageTicketsAbi,
        functionName: 'getApproved',
        args: args,
    });

    if (result) {
        console.log("Transaction successful, NFT allowance address = ", result);
        const isApproved = result === mortgagePoolContract;

        // Rebuild the array with updated isApproved status
        loanNFTs.update(nfts => {
            if (nfts[loanVault]) {
                return {
                    ...nfts,
                    [loanVault]: nfts[loanVault].map(loan => {
                        if (loan.id === loanId) {
                            return { ...loan, isApproved: isApproved };
                        }
                        return loan;
                    })
                };
            }
            return nfts;
        });
        console.log("mortgagePool contract approved status: ", isApproved);
        return isApproved;
    } else {
        console.error("Transaction failed");
        return false;
    }
}


export async function updateAvailableToRedeem(id){
    if (get(redeemableNFTs).length<0){
        const _chainId = get(chainId);
        let _availableToRedeem = get(availableToRedeem);
        const _dropdownSelectionNames = get(dropDownSelectionsNames);
        const _redeemableNFTs = get(redeemableNFTs);
        const vault = _redeemableNFTs[id].vaultName;
        console.log("updateAvailableToRedeem _redeemableNFTs[id].vaultName = ", _redeemableNFTs[id].vaultName);
        const mortgageConversionVaultAddress = mortgageContractsInfo[Number(_chainId)].vaults[vault].coreContracts["Mortgage Conversion Vault"].address;
        const args =[];
        _availableToRedeem = await runViewFunction({
            contractAddress: mortgageConversionVaultAddress,
            abi: mortgageConversionVaultAbi,
            functionName: 'totalAssets',
            args: args,
        });
        // console.log("availableToRedeem = ", _availableToRedeem);
        availableToRedeem.set(_availableToRedeem);
    }
    

}

export function findVaultIdentifierByIndex(mortgageContractsInfo, chainId, index) {
    const vaults = mortgageContractsInfo[chainId]?.vaults;
    if (!vaults) return null;

    const vaultIdentifiers = Object.keys(vaults);
    // Calculate the adjusted index to wrap around if it exceeds the number of vaults
    const adjustedIndex = index % vaultIdentifiers.length;

    return vaultIdentifiers[adjustedIndex] || null;
}

// Convert token amount to its smallest unit (like Wei for Ethereum)
export function toWei(amount, decimals) {
    const amountBigNumber = new BigNumber(amount);
    const factor = new BigNumber(10).pow(decimals);
    // Using .toFixed(0) to ensure we get a string without decimal places, but without unnecessary trailing zeros
    return amountBigNumber.multipliedBy(factor).toFixed(0);
}

// Convert amount in smallest unit back to the standard token unit, removing unnecessary trailing zeros
export function fromWei(amount, decimals) {
    const amountBigNumber = new BigNumber(amount);
    const factor = new BigNumber(10).pow(decimals);
    // Using .toFixed() with dynamic precision based on the actual value
    const result = amountBigNumber.dividedBy(factor);
    const decimalPlaces = result.decimalPlaces() ?? decimals;
    return result.toFixed(Math.min(decimalPlaces, decimals));
}


export function convertUnixTimestampToDate(unixTimestamp) {
    // Create a new Date object based on the Unix timestamp
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds

    // Format the date as a string (e.g., "Mon, 25 Dec 1995 13:30:00 GMT")
    // You can adjust the format as needed
    return date.toUTCString();
}

export function calculateDifferenceBetweenTimestamps(timestamp1, now) {
    // Calculate the difference in seconds
    const differenceInSeconds = timestamp1 - now;

    return differenceInSeconds;
}

export function formatDuration(durationInSeconds) {
    // Check if the duration is negative (time in the past)
    const isPast = durationInSeconds < 0;

    // Use the absolute value for calculation
    let durationAbs = Math.abs(durationInSeconds);

    // Calculate days, hours, and minutes
    let days = Math.floor(durationAbs / (3600 * 24));
    const hours = Math.floor((durationAbs % (3600 * 24)) / 3600);
    const minutes = Math.floor((durationAbs % 3600) / 60);

    // Build the formatted string
    let formattedDuration;
    if (days > 1) {
        formattedDuration = `${days} days ${hours} h`;
    } else if (days === 1) {
        formattedDuration = `${days} day ${hours} h`;
    } else {
        formattedDuration = `${hours} h ${minutes} m`;
    }

    // Add a prefix to indicate past time if necessary
    if (isPast) {
        formattedDuration = `-${formattedDuration}`;
    }

    return formattedDuration;
}


export async function getPendingConversionData(id, vault){
    //console.log("getPendingConversionData, id = ", id, "vault = ", vault);
    const _chainId = get(chainId);
    const conversionVaultTicketsContract = mortgageContractsInfo[Number(_chainId)].vaults[vault].nfts["Conversion vault Tickets"].address;
    const experationArgs = [id];
    const experation = await runViewFunction({
        contractAddress: conversionVaultTicketsContract,
        abi: mortgageTicketsAbi,
        functionName: 'experation',
        args: experationArgs,
    });
    //console.log("getPendingConversionData, experation = ", experation);
    const sizeArgs = [id];
    const size = await runViewFunction({
        contractAddress: conversionVaultTicketsContract,
        abi: mortgageTicketsAbi,
        functionName: 'size',
        args: sizeArgs,
    });
    //console.log("getPendingConversionData, size = ", size);
   
    return {
        experationDate:  experation,
        conversionSize: size,

    }

}



export async function updatePricePerCoin(vault, favTokenToggle) {
    // Fetch the current chain ID
    const _chainId = get(chainId);

    let depositTokenDecimals;
    let redeemTokenDecimals;
    let previewRedeem;
    let totalSupply;

    if(favTokenToggle){
        //console.log("updatePricePerCoin Starting FAV pricePerCoin");
        // Get the mortgage conversion vault address and decimals
        const mortgageFeeConversionVault = mortgageContractsInfo[Number(_chainId)].vaults[vault].coreContracts["Mortgage Fee Conversion Vault"].address;
        depositTokenDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vault].tokens["Mortgage Synth"].decimals;
        redeemTokenDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vault].coreContracts["Mortgage Pool"].decimals;

        // Get total supply
        const totalSupplyArgs = [];
        //console.log("updatePricePerCoin mortgageFeeConversionVault contract = ", mortgageFeeConversionVault, " mortgageFeeConversionVaultAbi = ", mortgageFeeConversionVaultAbi);
        totalSupply = await runViewFunction({
            contractAddress: mortgageFeeConversionVault,
            abi: mortgageFeeConversionVaultAbi,
            functionName: 'totalSupply',
            args: totalSupplyArgs,
        });
        //console.log("updatePricePerCoin totalSupply = ", totalSupply);

        // Get preview redeem value
        const previewRedeemArgs = [totalSupply];
        previewRedeem = await runViewFunction({
            contractAddress: mortgageFeeConversionVault,
            abi: mortgageFeeConversionVaultAbi,
            functionName: 'previewRedeem',
            args: previewRedeemArgs,
        });
        //console.log("updatePricePerCoin previewRedeem = ", previewRedeem);
    }

    else {   
        console.log("updatePricePerCoin Starting non-FAV pricePerCoin"); 
        // Get the mortgage conversion vault address and decimals
        const mortgageConversionVault = mortgageContractsInfo[Number(_chainId)].vaults[vault].coreContracts["Mortgage Conversion Vault"].address;
        depositTokenDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vault].tokens["Deposit erc20"].decimals;
        redeemTokenDecimals = mortgageContractsInfo[Number(_chainId)].vaults[vault].tokens["Stablecoin"].decimals;

        // Get total supply
        const totalSupplyArgs = [];
        totalSupply = await runViewFunction({
            contractAddress: mortgageConversionVault,
            abi: mortgageConversionVaultAbi,
            functionName: 'totalSupply',
            args: totalSupplyArgs,
        });

        // Get preview redeem value
        const previewRedeemArgs = [totalSupply];
        previewRedeem = await runViewFunction({
            contractAddress: mortgageConversionVault,
            abi: mortgageConversionVaultAbi,
            functionName: 'previewRedeem',
            args: previewRedeemArgs,
        });
    }


    // Convert to BigNumber
    const totalSupplyBN = new BigNumber(totalSupply.toString());
    const previewRedeemBN = new BigNumber(previewRedeem.toString());

    // Convert to human-readable format (assuming decimals are correct)
    const totalSupplyFromWei = totalSupplyBN.shiftedBy(-depositTokenDecimals);
    const previewRedeemFromWei = previewRedeemBN.shiftedBy(-redeemTokenDecimals);

    // Perform the division using BigNumber
    const pricePerCoinBN = previewRedeemFromWei.div(totalSupplyFromWei);

    // Convert the result back to a string
    const _pricePerCoin = pricePerCoinBN.toString();

    // Log the calculated price per coin
    // console.log("Update price per coin calc: (previewRedeem)", previewRedeemFromWei.toString(), "/(totalSupply) ", totalSupplyFromWei.toString());
    //console.log("Update price per coin = ", _pricePerCoin);

    // Set the new price per coin
    pricePerCoin.set(_pricePerCoin);

    return _pricePerCoin;
}




export async function transfer(tokenName, account, amount) {
    let _hash;
        try {
            const gasPrice = await getGasPrice(); 
            const providerNode = await getProviderNode();
            const signer = providerNode.getSigner();
            let chainId = await getChainId();
            let userBalances = await getUserBalances();
            const contract = userBalances[chainId]["stablecoin"][tokenName]["tokenContract"];
  
            const tokenContract: any = new ethers.Contract(contract, erc20Abi, signer);
            const gasLimit = await tokenContract.estimateGas.transfer(account,BigNumber(amount).toFixed(),{ from: account });
            const txResponse = await tokenContract.transfer(
                account,
                BigNumber(amount).toFixed(),
                {
                    gasLimit: gasLimit,
                    gasPrice: gasPrice
                }
            );
            console.log(txResponse.hash);
            _hash = txResponse.hash;
            const txReceipt = await txResponse.wait();
            console.log(txReceipt);
            return true
        }
        catch (error) {
            console.log(error);
            return false
        }
}



export function txCanBeInitiated(lastTxAddedToRegister) {
    let _chainId;
    let unsubscribe = chainId.subscribe(value => {
        _chainId = value;
    });
    unsubscribe();
    let _user;
    unsubscribe = user.subscribe(value => {
        _user = value;
    });
    unsubscribe();
    if (_user == "0x0000000000000000000000000000000000000000") {
        content.set({"title": "Wallet not connected", "description": "Start by connecting your wallet in order to use Cat-in-a-Box's functionalities."});
        visibility.set("block");
        return false;
    }
    else if (!networkNameByChainId.hasOwnProperty(_chainId)) {
        content.set({"title": "Wrong network", "description": "This network is not supported."});
        visibility.set("block");
        return false;
    }/*
    else if (lastTxAddedToRegister == false) {
        content.set({"title": "Pending transaction", "description": "Please wait a moment until the previous transaction has been sent."});
        visibility.set("block");
        return false;
    }*/
    return true;
}

export async function getGasPrice() {
    let _alchemyNode = await getRpcNode();
    const speedFactor = 1.2; // TODO: change to one for production
    const suggestedGasPrice = await _alchemyNode.eth.getGasPrice(function(e, r) {return r;})
    const gasPrice = parseInt(suggestedGasPrice) * speedFactor;
    return Math.round(gasPrice);
}

async function getRpcNode() {
    let _alchemyNode;
    const unsubscribe = alchemyNode.subscribe(value => {
        _alchemyNode = value;
    });
    unsubscribe();
    return _alchemyNode
}

async function getUser() {
    let _user;
    const unsubscribe = user.subscribe(value => {
        _user = value;
    });
    unsubscribe();
    return _user
}

async function getChainId() {
    let _chainId;
    let unsubscribe = chainId.subscribe(value => {
        _chainId = value;
    });
    unsubscribe();
    return _chainId
}

async function getProviderNode() {
    let _providerNode;
    const unsubscribe = providerNode.subscribe(value => {
        _providerNode = value;
    });
    unsubscribe();
    return _providerNode
}

async function getUserBalances() {
    let _userBalances;
    const unsubscribe = userBalances.subscribe(value => {
        _userBalances = value;
    });
    unsubscribe();
    return _userBalances
}

async function getMortgagePoolContract() {
    let _mortgagePool;
    const unsubscribe = mortgagePoolContractFunctions.subscribe(value => {
        _mortgagePool = value;
    });
    unsubscribe();
    return _mortgagePool
}

async function getDropDownSelectionsNames() {
    let _dropDownSelectionsNames;
    const unsubscribe = dropDownSelectionsNames.subscribe(value => {
        _dropDownSelectionsNames = value;
    });
    unsubscribe();
    return _dropDownSelectionsNames
}

async function getDropDownSelections() {
    let _dropDownSelections;
    const unsubscribe = dropDownSelections.subscribe(value => {
        _dropDownSelections = value;
    });
    unsubscribe();
    return _dropDownSelections
}

async function getContractAddresses() {
    let _contractAddresses;
    const unsubscribe = contractAddresses.subscribe(value => {
        _contractAddresses = value;
    });
    unsubscribe();
    return _contractAddresses
}

export function toTimer(inputtimer, blocktime) {
    inputtimer -= blocktime;
    const hours = Math.floor(inputtimer/ 60 / 60);
    const minutes = Math.floor((inputtimer/ 60) % 60);
    const seconds = Math.floor((inputtimer) % 60);
    const hourString = String(hours).padStart(2, "0");
    const minuteString = String(minutes).padStart(2, "0");
    const secondString = String(seconds).padStart(2, "0");

    
    const timerString = `${hourString}:${minuteString}:${secondString}`;
    return(timerString);

}


// Helper function to extract substring
export function getSubStringAfterDash(str) {
    const parts = str.split("-");
    // Check if there is a part after the dash
    return parts.length > 1 ? parts[1].trim() : str;
}

export function getSubStringBeforeDash(str) {
    const parts = str.split("-");
    // Return the part before the dash
    return parts.length > 1 ? parts[0].trim() : str;
}

export function toTitleCase(str) {
    if (typeof str !== 'string') {
        // Return an empty string or some default value
        // if the input is not a string
        return '';
    }
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



