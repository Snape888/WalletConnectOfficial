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
                        address: "0xd3E6Af1BCfe243e51e7817F7B398B44066C01f44",
                        decimals:18,
                        ticker:"FAV-AWMATIC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable AWMATIC-DAI.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x79c0550A0980d317FA602B9f06D2ea18210a2265",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0xDA3923E9c487954ED9C27b963538f110Cf284fC3",
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
                        address: "0xd3E6Af1BCfe243e51e7817F7B398B44066C01f44",
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
                        address: "0xB1e529A89164f43132f912f85D8Eff3d712094fD",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0xd82480eb78eEeaf74eAda0d848D1a46499aaE640",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x987F1f4C76AFEEA291C846c84fb11b8979087040",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },
            "WBTC-DAI":{
                id:1,
                ticker:"WBTC-DAI",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0xb0AEB992c8B67df03e349CA7972a97D4C6e3AC1E",
                        decimals:18,
                        ticker:"FAV-WBTC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable WBTC-DAI.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x9b8199B86faF6800d7e395816252D3Cf9169F3bC",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x190c84577d157856d2db5d218966bD86F28aE59d",
                        lastUpdated: "4/2/24"
                    },
                },
                tokens:{
                    "Deposit erc20":{ /// This is the token address of the ERC20 FAV swap user sell to FAV
                        alias: "tradeable address",
                        fileName: "",
                        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                        lastUpdated: "4/2/24",
                        decimals:8,
                        ticker:"WBTC",
                        tokenIcon:"/defiLogos/wBTC.svg",

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
                        address: "0xb0AEB992c8B67df03e349CA7972a97D4C6e3AC1E",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV-WBTC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable WBTC-DAI.svg",

                    },
                },
                nfts:{
                    "Conversion vault Tickets":{ // conversion vault
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x268B639449E5f8bBAcB57D1b47E36CB246cB51f4",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim WBTC-DAI.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0xa69e4Dd0276f73d3A252099Cb7D33FB1bEb80a83",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim WBTC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0xCAe012296E99193cef593097a72eAE6471D979fe",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});
  








