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
                        address: "0x3005A7Ba34490649e71E4129a5b5Ba19636f605f",
                        decimals:18,
                        ticker:"FAV-DAI-AWMATIC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0xa01B86210774bAbeF798B8EA94Abf586E6234f43",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x47E64F0583bE5F21C9941D940A53aAfD62E16B9a",
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
                        address: "0x3B9c37af10c6a03FFE454966E74e99a57BfCF86a",
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
                        address: "0xE4bcF7429732DCE54fD987aD0abc5ad017D3F0f1",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-AWMATIC.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x9235A46c8f1770e647d16353E1D07B8ED65F94aA",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x44Ac890ecFD8225b9AeC6681bb88F43F5f281F16",
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
                        address: "0xbc7b97edbEC66cE5b0f644610400602e372f2122",
                        decimals:18,
                        ticker:"FAV-DAI-WBTC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x4441145D404179d10784Bf84691d78465e679387",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x7069A6529EcbC03f175aeE02D4C49e5009D5c908",
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
                        address: "0x3B9c37af10c6a03FFE454966E74e99a57BfCF86a",
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
                        address: "0x6ee6A95bACd1dc1fdA3136487d25F5b93e5BfcA4",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-WBTC.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x9687b729B6DF5D4329671bDF8C32Ab5f7D0978D4",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-WBTC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x2C67E66B996830F9Cf8c2535893bF4363500ad7E",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});