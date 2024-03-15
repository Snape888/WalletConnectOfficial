//// Updating these addresses will update the whole site

export const mortgageContractsInfo = ({
    "0x89": {  /// Polygon contracts -------------------------
        networkID: "1",
        networtName: "polygon",
        vaults:{
            "DAI-AWMATIC":{
                id:1,
                ticker:"DAI-AWMATIC",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0xcCDBD6Be52dc6441e7F40407B1D312b3F78Da774",
                        decimals:18,
                        ticker:"FAV-DAI-AWMATIC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0xCE459d9d65008df0D9Da7fd27dC856e22D4D8d55",
                        decimals:18,
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0xc589fCe5eEDE502365f1d8F04EC532B9404D0803",
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
                    "Mortgage Synth":{ /// This is the FAV incentive token
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0x4FBdD9974C33c898F3CB5837fA6E3E109B617757",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV",
                        tokenIcon:"/utilityTokens/FAV-token.svg",

                    },
                },
                nfts:{
                    "Conversion vault Tickets":{ // AKA 'mortgage tickets'
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x85b4AA73eAbE23FF9FfAE69D628DE6dE4a11B5AC",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x6e0Bb84494a03351C373A3584d328Ec8735829c1",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-AWMATIC FAV",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x69678f82fef3c9e17D239DA05dc6d31e1188c312",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },
            "DAI-WBTC":{
                id:1,
                ticker:"DAI-WBTC",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0x7339E9Ea72903DB150C118f5512b70F23dDa1a44",
                        decimals:18,
                        ticker:"FAV-DAI-WBTC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x9bA8D98D309cb18055c8Cd8fa01Cb37E1C07c6db",
                        decimals:18,
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x18153f3E1EACa1a5c84c395ED2D892105C5465Ef",
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
                    "Mortgage Synth":{ /// This is the FAV incentive token
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0x4FBdD9974C33c898F3CB5837fA6E3E109B617757",
                        lastUpdated: "4/2/24",
                        decimals:18,
                        ticker:"FAV",
                        tokenIcon:"/utilityTokens/FAV-token.svg",

                    },
                },
                nfts:{
                    "Conversion vault Tickets":{ // AKA 'mortgage tickets'
                        alias: "tickets",
                        fileName: "mortgagetickets.json",
                        address: "0x3d21e2410b46Ff93375E633EBDbBa8741e06633a",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x95bB94dCEE8AAC2be7f3EbB1Dc3F37E02d5Fb569",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-WBTC FAV",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x3557838a17b63B03F4A6Bcd16AB5a82695657ca3",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});