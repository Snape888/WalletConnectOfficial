//// Updating these addresses will update the whole site

export const mortgageContractsInfo = ({
    "0x89": {  /// Polygon contracts -------------------------
        networkID: "1",
        networtName: "polygon",
        vaults:{
            "AWMATIC-DAI":{
                id:1,
                ticker:"AWMATIC-DAI",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        // address: "0x0f1134D8ed24F9eb75F8D0deaDfDe1a05b35032F", // Old addy
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x20e57C0F2d202677eA80A3c54b3471dB03f5D871",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x8960C391782C820Fb4c3f9e908Bb4332338c1e16",
                        lastUpdated: "4/2/24"
                    },
                },
                tokens:{
                    "Deposit erc20":{ /// This is the token address of the ERC20 FAV swap user sell to FAV
                        alias: "tradeable address",
                        fileName: "",
                        address: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"AWMATIC",
                        tokenIcon:"/defiLogos/AWmatic.svg",

                    },
                    "Stablecoin":{ /// This is stablecoin token that FAV Earn users deposit
                        alias: "stablecoin",
                        fileName: "erc20.json",
                        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"DAI",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Mortgage Synth":{ /// This is the FAV stablecoin associated with the vault
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV-AWMATIC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable AWMATIC-DAI.svg",

                    },
                },
                nfts:{
                    "Conversion vault Tickets":{ // conversion vault
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x4C418fe0e208eFbf1883ada33295EB2658F59b6E",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x07B92E0244817F64e4CaB8B216ab5602d5dd963F",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0xa0390980f1740874a2f449e7BDa0F2772F7e7762",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },
            "AWMATIC-USDC":{
                id:1,
                ticker:"AWMATIC-USDC",
                coreContracts:{
                    "Mortgage Contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0xa0390980f1740874a2f449e7BDa0F2772F7e7762",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        // address: "0x0f1134D8ed24F9eb75F8D0deaDfDe1a05b35032F", // Old addy
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x20e57C0F2d202677eA80A3c54b3471dB03f5D871",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x8960C391782C820Fb4c3f9e908Bb4332338c1e16",
                        lastUpdated: "4/2/24"
                    },
                },
                tokens:{
                    "Deposit erc20":{ /// This is the token address of the ERC20 FAV swap user sell to FAV
                        alias: "tradeable address",
                        fileName: "",
                        address: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"AWMATIC",
                        tokenIcon:"/defiLogos/AWmatic.svg",

                    },
                    "Stablecoin":{ /// This is stablecoin token that FAV Earn users deposit
                        alias: "stablecoin",
                        fileName: "erc20.json",
                        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"USDC",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Mortgage Synth":{ /// This is the FAV stablecoin associated with the vault
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV-AWMATIC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable AWMATIC-DAI.svg",

                    },
                },
                nfts:{
                    "Mortgage Tickets":{
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x07B92E0244817F64e4CaB8B216ab5602d5dd963F",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",

                    },
                    "Mortgage Fee Tickets":{
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x4C418fe0e208eFbf1883ada33295EB2658F59b6E",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",


                    },
                }  
            },
            "WBTC-DAI":{
                id:1,
                ticker:"WBTC-DAI",
                coreContracts:{
                    "Mortgage Contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0xa0390980f1740874a2f449e7BDa0F2772F7e7762",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        // address: "0x0f1134D8ed24F9eb75F8D0deaDfDe1a05b35032F", // Old addy
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x20e57C0F2d202677eA80A3c54b3471dB03f5D871",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x8960C391782C820Fb4c3f9e908Bb4332338c1e16",
                        lastUpdated: "4/2/24"
                    },
                },
                tokens:{
                    "Deposit erc20":{ /// This is the token address of the ERC20 FAV swap user sell to FAV
                        alias: "tradeable address",
                        fileName: "",
                        address: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"WBTC",
                        tokenIcon:"/defiLogos/AWmatic.svg",

                    },
                    "Stablecoin":{ /// This is stablecoin token that FAV Earn users deposit
                        alias: "stablecoin",
                        fileName: "erc20.json",
                        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"DAI",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Mortgage Synth":{ /// This is the FAV stablecoin associated with the vault
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0x03F5975E239Fad041A7d7fBbEeDfB4CE571c4DFB",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV-AWMATIC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable AWMATIC-DAI.svg",

                    },
                },
                nfts:{
                    "Mortgage Tickets":{
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x07B92E0244817F64e4CaB8B216ab5602d5dd963F",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",

                    },
                    "Mortgage Fee Tickets":{
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x4C418fe0e208eFbf1883ada33295EB2658F59b6E",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",


                    },
                }  
            },
        }
    }
});
  








