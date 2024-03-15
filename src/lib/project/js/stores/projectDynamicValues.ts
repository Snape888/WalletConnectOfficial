/// Svelte imports
import { get } from 'svelte/store';
import { writable } from 'svelte/store';

import {mortgageContractsInfo} from '$lib/project/js/contractAddresses';

/// Boilerplate Web3 imports
import { _round } from "$lib/boilerplate/js/core";
import { triggerCdpsAppContractCalls, user, chainId, alchemyNode } from "$lib/boilerplate/js/stores/wallet";


//-----------------------------------------------------------------------------------------------------------------
// General variables ----------------------------------------------------------------------------------------------
export const copied = writable(false); // Store to control the display of the "Copied" message
export const userBalance = writable("n/a");
export const pricePerCoin = writable();
// Define the type for the network object
export interface NetworkInfo {
    networkHex: string;
    networkName: string;
  }
export const supportedNetworks = writable<NetworkInfo[]>([]);
export const supportedNetworkNames = writable([]);
export const connectedAndSupported = writable(false);

export const exchangeRates = writable({
});


export const userBalances = writable({
    "0x1": { // Ethereum Mainnet
        "networkID": "1",
        "networkName": "ethereum",
        "stablecoin": {
            "DAI": {   
                "tokenName": "DAI",
                "tokenContract": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "USDC": {
                "tokenName": "USDC",
                "tokenContract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": 6,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "FRAX": {
                "tokenName": "FRAX",
                "tokenContract": "0x853d955acef822db058eb8505911ed77f175b99e", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "LUSD": {
                "tokenName": "LUSD",
                "tokenContract": "0x5f98805a4e8be255a32880fdec7f6728c6568ba0", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "WBTC": {
                "tokenName": "WBTC",
                "tokenContract": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                "decimals": 8,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "MASQ": {    
                "tokenName": "MASQ",
                "tokenContract": "0x06f3c323f0238c72bf35011071f2b5b7f43a054c",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
        },
        "favstablecoin": {
            "DAI": {   
                "tokenName": "DAI",
                "tokenContract": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "USDC": {
                "tokenName": "USDC",
                "tokenContract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "decimals": 6,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "FRAX": {
                "tokenName": "FRAX",
                "tokenContract": "0x853d955acef822db058eb8505911ed77f175b99e", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "LUSD": {
                "tokenName": "LUSD",
                "tokenContract": "0x5f98805a4e8be255a32880fdec7f6728c6568ba0", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "WBTC": {
                "tokenName": "WBTC",
                "tokenContract": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                "decimals": 8,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
        },
        "erc20": {
            "STETH": {    
                "tokenName": "STETH",
                "tokenContract": "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "ALETH": {    
                "tokenName": "ALETH",
                "tokenContract": "0x0100546F2cD4C9D97f798fFC9755E47865FF7Ee6",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "MASQ": {    
                "tokenName": "MASQ",
                "tokenContract": "0x06f3c323f0238c72bf35011071f2b5b7f43a054c",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
        }, 
        "nft": {
            "REDACTED": {    
                "tokenName": "REDACTED",
                "tokenContract": "0x10051272122560bddd5771B67D8d7c29d08A6c58",
                "decimals": 18,
                "type": "ERC721",
                "active": true,
                "balance": "0",
                "ownedIds": [],
            },
            // "turbotoad": {   
            //     "tokenName": "TURBOTOAD",
            //     "tokenContract": "0x49690ca88fAf70025748Bb15eC87Cb0Df85b3935",
            //     "decimals": 18,
            //     "type": "ERC1155",
            //     "active": true,
            //     "balance": "0"
            // },
        }, 

        
    },
    "0x89": { // Polygon Mainnet
        "networkID": "1",
        "networtName": "polygon",
        /// Stablecoin balances -------------------------
        "stablecoin": {
            "DAI":{   
                "tokenName": "DAI",
                "tokenContract": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "USDC": {
                "tokenName": "USDC",
                "tokenContract": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                "decimals": 6,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "FRAX": {
                "tokenName": "FRAX",
                "tokenContract": "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "LUSD": {
                "tokenName": "LUSD",
                "tokenContract": "0x23001f892c0c82b79303edc9b9033cd190bb21c7", 
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            "WBTC": {
                "tokenName": "WBTC",
                "tokenContract": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
                "decimals": 8,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            
        },
        "favstablecoin": {
            "AWMATIC-DAI": {   
                "tokenName": "AWMATIC-DAI",
                "tokenContract": "0xe49af4075C0E047605ef33C8A0a1F74938a50F8e",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
            
        },
        "erc20": {
            "MASQ": {    
                "tokenName": "MASQ",
                "tokenContract": "0xee9a352f6aac4af1a5b9f467f6a93e0ffbe9dd35",
                "decimals": 18,
                "type": "ERC20",
                "active": true,
                "balance": "0",
                "rawBalance": "0"
            },
        }, 
    },

    // Add more networks with similar structure
});

export let txProcessMessage = writable(false);

export const dropDownSelections = writable({
    //FAV Loans
    FAVLoanBorrowVault: 0,
    //FAV Earn
    FAVEarnDepositVault: 0, // Vault selected by user in FAV Earn deposit stables
    FAVEarnExchangeStable: 0,
    FAVEarnRedeemIOU: 0,
    // FAV Swap
    FAVSwapDepositVault: 0, // Vault selected by user in FAV Swap deposit erc20
    FAVSwapRedeemableNFTs: 0, // NFT selection of vault selected by user in FAV Swap recievable NFTs
    // System page
    FAVSystemLoanVault: 0, // Vault selected by user in FAV Swap deposit erc20
    DashboardLoans: [], /// update this by getting the ids of the nfts held in the users wallet then use those ids to derive the associated vaults

});

export const dropDownSelectionsNames = writable({
    //FAV Loans
    FAVLoanBorrowVault: "",
    //FAV Earn
    FAVEarnDepositVault: "", // Vault selected by user in FAV Earn deposit stables
    FAVEarnExchangeStable: "",
    FAVEarnRedeemIOU: "",
    //FAV Swap
    FAVSwapDepositVault: "", // Vault selected by user in FAV Swap deposit erc20
    FAVSwapRedeemableNFTs: "", // NFT selection of vault selected by user in FAV Swap recievable NFTs
    // System page
    FAVSystemLoanVault: "", // Vault selected by user in FAV Swap deposit erc20
    DashboardLoans: [], /// update this by getting the ids of the nfts held in the users wallet then use those ids to derive the associated vaults

});


// these update when the user selects vaults in the UI
export const contractAddresses = writable({
    mortgagePoolAddress : "",
    stablecoinAddress : "",
    stablecoinDecimals : "",
    depositErc20Address : "",
    depositErc20Decimals : "",
    mortgageConversionVaultAddress : "",
    favStableAddress : "",
    favStableDecimals : "",
});


/// Get allowances
export const FAVLoanDepositAllowance = writable("");
export const FAVEarnStablecoinDepositAllowance = writable("");
export const FAVSwaperc20DepositAllowance = writable("");
export const FAVLoanRepaymentsAllowance = writable({});



export const nftRemovalAllowances = writable([]);


export const walletBalances = writable<any>({});


export interface MortgagePoolContractValues {
    [key: string]: any; // Adjust the type according to your needs
  }
export const mortgagePoolContractValues = writable<MortgagePoolContractValues>({});

// Hold all the contracts view values plus the contract info
export const mortgagePoolContractFunctions = writable({
        view:{
            "amountPayed":{ // how much borrower has paid down
                input1: "0",
                output: "amountPayedOutput"
            },
            "balanceOf":{ // FAV stables balance
                input1: get(user),
                output: "balance",
            },
            "baseSize":{ // How much borrower pays for all coins excluding fees
                input1: "0",
                output: "balance",
            },
            "buffer":{
                output: "buffer",
            },
            "calculateAPR":{ // Stablecoin APR if you deposit into fav earn multiply by 100x for UI
                output: "calculateAPR",
            },
            "coinsInContracts":{
                output: "coinsInContracts",
            },
            "coinSize":{ // Amount of coins to be paid out at end of loan
                input1: "0",
                output: "coinSize",
            },
            "contractCoin":{
                output: "contractCoin",
            },
            "contracts":{
                output: "contracts",
            },
            "conversionVault":{
                output: "conversionVault",
            },
            "decimals":{
                output: "decimals",
            },
            "expiration":{ // Expiration date in date/time format
                input1: "0",
                output: "expiration",
            },
            "feeReceiver":{
                output: "feeReciever",
            },
            "feeSize":{ // All fees for the entirely of the contract
                input1: "0",
                output: "feeSize",
            },
            "freeCoins":{ // How many coins are available to borrow
                output: "freeCoins",
            },
            "inExitLine":{ // total number of global outstanding IOU balance
                output:"inExitLine", 
            },
            "mySizeWaitingForExit":{ // Earn user IOU balance
                input1: get(user),
                output: "mySizeWaitingForExit",
            },
            "openDebt":{ // Current payment pending, default at this size ,seconds to liquidation
                input1: "0",
                output: "openDebt",
            },  
            "Owing":{ // FAV Earn user owning balance update (maybe add to fav stables balance)
                input1: get(user),
                output: "ownig",
            },  
            "simulateMonthlyPayment":{ // Needed to preview the users loan
                input1: "1", //Size
                input2: "1", // duration
                output: "simulateMonthlyPayment",
            },
            "stablesInContracts":{ // DeFi Stables available 
                output: "stablesInContracts",
            },
            "totalSupply":{ // FAV Stable 
                output: "totalSupply",
            },
        },
        write:{
            "approve":{ // Approve spending for an address
                input1: "spenderAddress",
                input2: "amount"
            },
            "burnToGetOutInLine":{ // Burn fav stable coins to get IOU balance
                input1: "contractId",
            },
            "createContract":{ // Create loan
                input1: "size",
                input2: "duration",
                input3: "maxPaymentPerMonth",
                input4: "ref" // Referral address
            },
            "defaultContract":{ // 
                input1: "nftId",                
            },
            "deposit":{ // 
                input1: "contractId", // Reciever is the reciever of FAV stables, usually it's the depositor 
                imput2: "amount"
            },
            "earlyRepayContractInFull":{ // 
                input1: "nftId",
            },
            "payDownContract":{ // 
                input1: "contractId",
                input2: "size"
            },
            "transfer":{ // Transfer users tokens to
                input1: "recipientAddress",
                output: "amount"
            },
            "transferFrom":{ // Transfer tokens from address to address
                input1: "senderAddress",
                input2: "recipientAddress",
                input3: "amount"

            },           
        }
    

});

export const erc20ContractFunctions = writable({
    view:{
        "allowance":{ // check approval allowance of any third party contract to spend
            input1: get(user), // user address
            input2: "", // spender address
            output: "" 
        },        
        "balanceOf":{ // Stables balance
            input1: get(user),
            output: "balance",
        },
        "totalSupply":{ // FAV Stable 
            output: "totalSupply",
        },
    },
    write:{
        "approve":{ // Approve spending for an address
            input1: "spenderAddress",
            input2: "amount"
        },
        "transfer":{ // Transfer users tokens to
            input1: "recipientAddress",
            output: "amount"
        },
        "transferFrom":{ // Transfer tokens from address to address
            input1: "senderAddress",
            input2: "recipientAddress",
            input3: "amount"

        },           
    }


});



export const protocolInfo = writable([
    {
        id: 1,
        name: "noEthContracts",
        value: "1345",        
    },
    {
        id: 2,
        name: "ethTVL",
        value: "5,786",        
    },
    {
        id: 3,
        name: "ethDebt",
        value: "45,890",        
    }
]);
//-----------------------------------------------------------------------------------------------------------------
//Dashboard page---------------------------------------------------------------------------------------------------

export const referralLink = writable("https://fav.finance/"); //Users referral link
export let payOutstandingAmount = writable({});
export let loanManagementButtonLabels = writable({});
export const finaliseLoanButtonLabel = writable({});


//Loans belonging to the currently connected user
export const loanNFTs = writable({});


export const myLoans = writable([
    {
        contract: 4,
        loanAmount: "4,337",
        token: "ETH",
        remainingTerm: "6 (12) months",
        paymentDue: "67,905",
        totalRemaining: "2,543,234", 
        defaultInDays:"11",    
        tabState:"outstanding" 
    },
    {
        contract: 5,
        loanAmount: "4,337",
        token: "ETH",
        remainingTerm: "6 (12) months",
        paymentDue: "53,905",
        totalRemaining: "2,543,234",  
        defaultInDays:"6",    
        tabState:"outstanding"            
    },
    {
        contract: 6,
        loanAmount: "4,337",
        token: "ETH",
        remainingTerm: "6 (12) months",
        paymentDue: "87,905",
        totalRemaining: "2,543,234", 
        defaultInDays:"2",    
        tabState:"outstanding"          
    }
]);


//A list of vaults the user is subscribed to by simply holding any FAV stables, one vault per stable
export const myVaults = writable([
    {
        vault: "ETH-USDC",
        vaultIcon:"/utilityTokens/FAVStable ETH-USDC.svg",
        amount: "1,337",
        currentAPY: "10%",
        vaultUtilisation: "82%",
        redeemable: "2,543,234", 
         
    },

]);

// list of values associated between the user and the mortgagePool contract
export const myIOUs = writable([
    {
        vault: "ETH-USDC",
        vaultIcon:"/utilityTokens/FAVClaim ETH-USDC.svg",
        amount: "502",
        redeemable: "2,987,234", 
         
    },
    {
        vault: "ETH-LSDC",
        vaultIcon:"/utilityTokens/FAVClaim ETH-USDC.svg",
        amount: "235",
        redeemable: "532,784", 
         
    },
    {
        vault: "wBTC-DAI",
        vaultIcon:"/utilityTokens/FAVClaim wBTC-DAI.svg",
        amount: "457",
        redeemable: "2,508.34", 
         
    },

]);

// List of NFTs the user holds
export const pendingConversions = writable([
    {
        vault: "ETH-USDC",
        vaultIcon:"/defiLogos/usd-coin-usdc-logo.svg",
        amount: "5.3 ETH",
        amountExpected: "11,675 USDC",
        remainingTerm: "3h 50mins" 
         
    },
]);

//-----------------------------------------------------------------------------------------------------------------
// FAV Loans page--------------------------------------------------------------------------------------------------
// loan summary of current loan being evaulated by user on Loans Page
export const loanSummary = writable({
    monthlyInstallment: "0",
    poolUtilisation: "0",
    interestRate: "0",
    depositSize:"0",
    totalRepayable: "0",
    basePrice: "0",
    tokensAvailable: "0"
});

interface BorrowVault {
    id: number;
    tokenIcon: string;
    ticker: string;
    tokenGreyed: boolean;
    available: string;
    stablecoinIcon: string;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
  }
  
  // Update the type of borrowVaults store
  export const borrowVaults = writable<BorrowVault[]>([]);

// list of vaults currently available to borrow from within the protocol 
export const borrowableVaults = writable([
    {
        id:213,
        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",
        token: "USDC",
        tokenGreyed: false,
        available: "| "+"1,200 available",
        availableGreyed: true,
        repayInToken: "| "+"Repay in USDC",
        repayInTokenGreyed: true,
        feeNote: "| "+"Lowest fees",
        feeNoteGreyed: true,
    },
    {
        id:9,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI",
        tokenGreyed: false,
        available: "| "+"980 available",
        availableGreyed: true,
        repayInToken: "| "+"Repay in DAI",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,        
    },
    {
        id:12,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI",
        tokenGreyed: false,
        available: "| "+"987,235 available",
        availableGreyed: true,
        repayInToken:"| "+"Repay in DAI",
        repayInTokenGreyed: true,
        feeNote: "| "+"Lowest fees", 
        feeNoteGreyed: true,      
    },
    {
        id:56,
        tokenIcon:"/defiLogos/frax-frax-logo.svg",
        token: "MATIC",
        tokenGreyed: false,
        available: "| "+"87,564 available",
        availableGreyed: true,
        repayInToken: "| "+"Repay in USD",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,       
    }
]);

// list of loan terms (at launch was 1-30yrs)
export const loanTerms = writable([
    {
        id:1,
        tokenIcon:"",
        ticker: "1 year",
        tokenGreyed: false,
        available: " 12 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:2,
        tokenIcon:"",
        ticker: "2 years",
        tokenGreyed: false,
        available: " 24 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:3,
        tokenIcon:"",
        ticker: "3 years",
        tokenGreyed: false,
        available: " 36 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:4,
        tokenIcon:"",
        ticker: "4 years",
        tokenGreyed: false,
        available: " 48 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:5,
        tokenIcon:"",
        ticker: "5 years",
        tokenGreyed: false,
        available: " 60 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:6,
        tokenIcon:"",
        ticker: "6 years",
        tokenGreyed: false,
        available: " 72 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:7,
        tokenIcon:"",
        ticker: "7 years",
        tokenGreyed: false,
        available: " 84 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:8,
        tokenIcon:"",
        ticker: "8 years",
        tokenGreyed: false,
        available: " 96 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:9,
        tokenIcon:"",
        ticker: "9 years",
        tokenGreyed: false,
        available: " 108 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:10,
        tokenIcon:"",
        ticker: "10 years",
        tokenGreyed: false,
        available: " 120 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:11,
        tokenIcon:"",
        ticker: "11 years",
        tokenGreyed: false,
        available: " 132 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:12,
        tokenIcon:"",
        ticker: "12 years",
        tokenGreyed: false,
        available: " 144 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:13,
        tokenIcon:"",
        ticker: "13 years",
        tokenGreyed: false,
        available: " 156 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:14,
        tokenIcon:"",
        ticker: "14 years",
        tokenGreyed: false,
        available: " 168 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:15,
        tokenIcon:"",
        ticker: "15 years",
        tokenGreyed: false,
        available: " 180 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:16,
        tokenIcon:"",
        ticker: "16 years",
        tokenGreyed: false,
        available: " 192 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:17,
        tokenIcon:"",
        ticker: "17 years",
        tokenGreyed: false,
        available: " 204 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,  
    },
    {
        id:18,
        tokenIcon:"",
        ticker: "18 years",
        tokenGreyed: false,
        available: " 216 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,  
    },
    {
        id:19,
        tokenIcon:"",
        ticker: "19 years",
        tokenGreyed: false,
        available: " 228 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:20,
        tokenIcon:"",
        ticker: "20 years",
        tokenGreyed: false,
        available: " 240 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:21,
        tokenIcon:"",
        ticker: "21 years",
        tokenGreyed: false,
        available: " 252 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:22,
        tokenIcon:"",
        ticker: "22 years",
        tokenGreyed: false,
        available: " 264 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:23,
        tokenIcon:"",
        ticker: "23 years",
        tokenGreyed: false,
        available: " 276 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,  
    },
    {
        id:24,
        tokenIcon:"",
        ticker: "24 years",
        tokenGreyed: false,
        available: " 288 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:25,
        tokenIcon:"",
        ticker: "25 years",
        tokenGreyed: false,
        available: " 300 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:26,
        tokenIcon:"",
        ticker: "26 years",
        tokenGreyed: false,
        available: " 312 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:27,
        tokenIcon:"",
        ticker: "27 years",
        tokenGreyed: false,
        available: " 324 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:28,
        tokenIcon:"",
        ticker: "28 years",
        tokenGreyed: false,
        available: " 336 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:29,
        tokenIcon:"",
        ticker: "29 years",
        tokenGreyed: false,
        available: "348 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:30,
        tokenIcon:"",
        ticker: "30 years",
        tokenGreyed: false,
        available: " 360 months",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    
]);


// LOAN SUMMARY SECTION
// Loan summary value to illustrate a users potential monthly installments
export const monthlyInstallmentPreview = writable();
// Loan summary value to illustrate a users potential base token price/current internal price of token
export const basePricePreview = writable();
// Loan summary value to illustrate a users potential total repayable
export const totalRepayablePreview = writable();

export const currentAPRs =writable([]);

//-----------------------------------------------------------------------------------------------------------------
// FAV Earn page---------------------------------------------------------------------------------------------------

// MAKE A DEPOSIT SECTION
// Earn vaults available to deposit into
interface DepositVault {
    id: number;
    tokenIcon: string;
    ticker: string;
    tokenGreyed: boolean;
    available: string;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
  }
  
  // Update the type of depositVaults store
  export const depositVaults = writable<DepositVault[]>([]);

export interface DepositVaultEntry {
    ticker: string;
    balance: string;
    rawBalance: string;
    tokenIcon: string;
    vault: string;
    id: number;
    available: string;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    tokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
  }
export const exchangeDepositVaults = writable<DepositVaultEntry[]>([]);

interface RedeemableIOU {
    id: number;
    tokenIcon: string;
    ticker: string;
    tokenGreyed: boolean;
    available: string;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
    redeemable: string;
    stablecoin: string;
  }
export const redeemableIOUBalances = writable<RedeemableIOU[]>([]);
export const selectedFAVEarnDepositVault = writable(0);
export const selectedFAVEarnDepositFAVStable = writable(0);
export const selectedFAVEarnDepositIOU = writable(0);

export const earnVaultSummary = writable({});


// shows the FAV stable balance of the currently selected deposit vault

// shows the FAV stable balance of the currently selected deposit vault
export const selectedFAVstableBalance = writable();
// shows the FAV stable balance of the currently selected deposit vault
export const selectedFAVVaultUtilisation = writable();
// shows the pool size of the currently selected deposit vault
export const selectedFAVVaultSize = writable();

// EXCHANGE FAV STABLES SECTION
// list of current user's held FAV stables
export const exchangableFAVStables = writable([
    {
        id:798,
        tokenIcon:"/utilityTokens/FAVStable ETH-USDC.svg",
        token: "ETH-USDC",
        tokenGreyed: false,
        available: "5470",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:147,
        tokenIcon:"/utilityTokens/FAVStable WBTC-USDC.svg",
        token: "wBTC-USDC",
        tokenGreyed: false,
        available: "4329",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,      
    },
    {
        id:987,
        tokenIcon:"/utilityTokens/FAVStable ETH-DAI.svg",
        token: "ETH-DAI",
        tokenGreyed: false,
        available: "980",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,    
    },
]);
// shows the balance of the currently selected FAV stable to burn
export const selectedFAVstableBurnBalance = writable();

// REDDEEM IOUs SECTION
// list of users current IOU balances
export const redeemIOUs = writable([
    {
        id:85,
        tokenIcon:"/utilityTokens/FAVClaim ETH-USDC.svg",
        token: "ETH-USDC",
        tokenGreyed: false,
        available: "~$4570",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:4,
        tokenIcon:"/utilityTokens/FAVClaim ETH-DAI.svg",
        token: "wBTC-USDC",
        tokenGreyed: false,
        available: "~$3570",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,      
    },
    {
        id:17,
        tokenIcon:"/utilityTokens/FAVClaim ETH-USDC.svg",
        token: "ETH-DAI",
        tokenGreyed: false,
        available: "~$570",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,    
    },
]);
// shows how much is available in the currently selected redemption vault
export const selectedVaultRedemptionSupply = writable();

//-----------------------------------------------------------------------------------------------------------------
// FAV Convert (SWAPS) page---------------------------------------------------------------------------------------------------

// SELL US YOUR ERC20 SECTION
// List of users ERC20's accepted by FAV
interface DepositSwapVault {
    id: number;
    tokenIcon: string;
    ticker: string;
    tokenGreyed: boolean;
    available: string;
    stablecoin: string;
    stablecoinIcon: string;
    stablecoinDecimals: number;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
    name: string;
  }
  
// Update the type of depositSwapVaults store
export const depositSwapVaults = writable<DepositSwapVault[]>([]);
export const recievableNFTs = writable([]);
interface RedeemableNFT {
    id: number;
    nftId: string;
    vaultName: string;
    tokenIcon: string;
    ticker: string;
    tokenGreyed: boolean;
    stablecoin: string;
    available: string;
    availableGreyed: boolean;
    repayInToken: string;
    repayInTokenGreyed: boolean;
    feeNote: string;
    feeNoteGreyed: boolean;
    amountSold: string;
    amountExpected: number;
    remainingTime: string;
    remainingTimeSeconds?: number;
    stablecoinDecimals: number;
  }
export const redeemableNFTs = writable<RedeemableNFT[]>([]);
export const availableToRedeem = writable();

export const swapToken = writable([
    {
        id:28,
        tokenIcon:"/defiLogos/eth_logo.svg",
        token: "ETH",
        tokenGreyed: false,
        available: "2345 DAI",
        availableGreyed: true,
        repayInToken: "| "+"36h 05mins",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:7,
        tokenIcon:"/defiLogos/eth_logo.svg",
        token: "ETH",
        tokenGreyed: false,
        available: "2348 USDC",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        
        id:756,
        tokenIcon:"/defiLogos/polygon-matic-logo.svg",
        token: "MATIC",
        tokenGreyed: false,
        available: "0.8972 DAI",
        availableGreyed: true,
        repayInToken: "| "+"36h 05mins",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
    {
        id:12,
        tokenIcon:"/defiLogos/wBTC.svg",
        token: "wBTC",
        tokenGreyed: false,
        available: "243340 USDC",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
]);
// shows the users balance of the currently selected ERC20 to sell
export const selectedSellableErc20Balance = writable();
// List of FAV vaults (FAV stables) available for the selected ERC20
export const swapRecieveToken = writable([
    {
        id:8,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI-NFT",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:74,
        tokenIcon:"/defiLogos/frax-frax-logo.svg",
        token: "FRAX-NFT",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:46,
        tokenIcon:"/defiLogos/liquity-usd-logo.svg",
        token: "LUSD-NFT",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
    {
        id:4,
        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",
        token: "USDC-NFT",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
]);
// Size of vault (FAV stable supply) of currently selected vault
export const selectedSellableErc20VaultSize = writable();


// REDEEM YOUR NFT SECTION
// List of all users redeemable NFTs on the current network
export const redeemableNFTsX = writable([
    {
        id:71,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI-NFT",
        tokenGreyed: false,
        available: "~$1254",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:6,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI-NFT",
        tokenGreyed: false,
        available: "~$964",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,      
    },
    {
        id:4,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "DAI-NFT",
        tokenGreyed: false,
        available: "~$254",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,    
    },
    {
        id:12,
        tokenIcon:"/defiLogos/frax-frax-logo.svg",
        token: "FRAX-NFT",
        tokenGreyed: false,
        available: "~$684",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:95,
        tokenIcon:"/defiLogos/liquity-usd-logo.svg",
        token: "LUSD-NFT",
        tokenGreyed: false,
        available: "~$2200",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,      
    },
    {
        id:41,
        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",
        token: "USDC-NFT",
        tokenGreyed: false,
        available: "~$3200",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,    
    },
]);

//-----------------------------------------------------------------------------------------------------------------
//System page------------------------------------------------------------------------------------------------------
// List of all borrowable vaults on current network
export const systemVaults = writable<any[]>([]);

/// old 
export const vaultFilter = writable([
    {
        id:8,
        tokenIcon:"/defiLogos/frax-frax-logo.svg",
        token: "ETH-FRAX",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,
    },
    {
        id:856,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "ETH-DAI",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true,     
    },
    {
        id:974,
        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",
        token: "ETH-USDC",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
    {
        id:465,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "MATIC-DAI",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
    {
        id:452,
        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",
        token: "MATIC-USDC",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
    {
        id:46,      
        tokenIcon:"/defiLogos/liquity-usd-logo.svg",
        token: "wBTC-LUSD",
        tokenGreyed: false,
        available: "",
        availableGreyed: true,
        repayInToken: "",
        repayInTokenGreyed: true,
        feeNote: "",
        feeNoteGreyed: true, 
    },
]);

// export const referUser = writable("0x6969")
export const referUser = writable<string | undefined>(undefined);
// List of all vault users loans 
export const vaultLoans = writable<any[]>([]);






/// old
export const protocolLoans = writable([
    {
        contract: 4,
        loanAmount: "4,337",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-DAI",
        defaultInDays:"11",   
    },
    {
        contract: 56,
        loanAmount: "37",
        token: "ETH",
        owner: "0x945..454",
        vault: "ETH-DAI",
        defaultInDays:"11",              
    },
    {
        contract: 874,
        loanAmount: "153",
        token: "wBTC",
        owner: "0xy6..76t",
        vault: "wBTC-USDC",
        defaultInDays:"0",           
    },
    {
        contract: 15,
        loanAmount: "2,007",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-USDC",
        defaultInDays:"11",   
    },
    {
        contract: 98,
        loanAmount: "2,007",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-USDC",
        defaultInDays:"9",   
    },
    {
        contract: 845,
        loanAmount: "1,007",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-USDC",
        defaultInDays:"9",   
    },
    {
        contract: 845,
        loanAmount: "77",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-USDC",
        defaultInDays:"8",   
    },
    {
        contract: 556,
        loanAmount: "37",
        token: "ETH",
        owner: "0x945..454",
        vault: "ETH-USDC",
        defaultInDays:"11",              
    },
    {
        contract: 94,
        loanAmount: "153",
        token: "ETH",
        owner: "0xy6..76t",
        vault: "ETH-DAI",
        defaultInDays:"0",           
    },
    {
        contract: 45,
        loanAmount: "1,547",
        token: "LUSD",
        owner: "0x456..454",
        vault: "wBTC-LUSD",
        defaultInDays:"11",   
    },
    {
        contract: 565,
        loanAmount: "37",
        token: "ETH",
        owner: "0x945..454",
        vault: "ETH-FRAX",
        defaultInDays:"11",              
    },
    {
        contract: 877,
        loanAmount: "183",
        token: "wBTC",
        owner: "0xy6..76t",
        vault: "wBTC-USDC",
        defaultInDays:"0",           
    },
    {
        contract: 154,
        loanAmount: "1,877",
        token: "ETH",
        owner: "0x456..454",
        vault: "ETH-FRAX",
        defaultInDays:"11",   
    },
    {
        contract: 252,
        loanAmount: "37",
        token: "ETH",
        owner: "0x945..454",
        vault: "ETH-USDC",
        defaultInDays:"11",              
    },
    {
        contract: 941,
        loanAmount: "1,253",
        token: "wBTC",
        owner: "0xy6..76t",
        vault: "wBTC-USDC",
        defaultInDays:"0",           
    },
]);

