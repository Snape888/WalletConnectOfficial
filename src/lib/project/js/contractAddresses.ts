//// Updating these addresses will update the whole site

export const mortgageContractsInfo = ({
    "137": {  /// Polygon contracts -------------------------
        networkID: 137,
        networkName: "polygon",
        vaults:{
            "DAI-AWMATIC":{
                id:1,
                ticker:"DAI-AWMATIC",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0xce2FcB9B715cBeE4D77Ad1941801D7ea0bDEcfe0",
                        decimals:18,
                        ticker:"FAV-DAI-AWMATIC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0xC303A0eC0Fd89D0366fA1114d8F2956785DfD60D",
                        decimals:18,
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x5BC85BdEc3a7f8E15C6dA420a6f78A82A096cd18",
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
                        address: "0x521A56841A0C9A6be8cd2eC39A54c690334490D1",
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
                        address: "0xD91D9EdcacA29b823c08FA6C3D8B46Ef068C07C8",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0xFEdf396EB1546d3cf5bBb3d24494E0f971F66ECA",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-AWMATIC FAV",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x2F701D0b05f79F427354aC54Eb3ff1e58D3b7C91",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },
            "USDC-AWMATIC":{
                id:1,
                ticker:"USDC-AWMATIC",
                coreContracts:{
                    "Mortgage Pool":{ // erc20 
                        alias: "pool address",
                        fileName: "mortgagepool.json",
                        address: "0x4a5881Fb08323d615Eb4382edF68CdEA5f2571c9",
                        decimals:18,
                        ticker:"FAV-USDC-AWMATIC",
                        tokenIcon:"/utilityTokens/FAVStable USDC-AWMATIC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x86F3Add7e75586D998b0e73C5F06114C02039593",
                        decimals:18,
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x5BC85BdEc3a7f8E15C6dA420a6f78A82A096cd18",
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
                        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                        lastUpdated: "4/2/24",
                        decimals:6,
                        ticker:"USDC",
                        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",

                    },
                    "Mortgage Synth":{ /// This is the FAV incentive token
                        alias: "Synthetic token address",
                        fileName: "mortgagesynth.json",
                        address: "0xe4F866821fe1bbf97aFe3890A3B484c30068391b",
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
                        address: "0xa00b81e25e0AA015EC7183deEFb27E3fcE491136",
                        lastUpdated: "4/2/24",
                        ticker:"USDC-NFT ",
                        tokenIcon:"/defiLogos/usd-coin-usdc-logo.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0xFEdf396EB1546d3cf5bBb3d24494E0f971F66ECA",
                        lastUpdated: "4/2/24",
                        ticker:"USDC-AWMATIC FAV",
                        tokenIcon:"/utilityTokens/FAVStable USDC-AWMATIC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0xc055E7B7A5260EaCdB5aE1A168345582617aDea7",
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
                        address: "0x909bf22431dffC7808831C412abFE755677c0760",
                        decimals:18,
                        ticker:"FAV-DAI-WBTC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x8107D6FAACdF3b03Fde83229254ACe19870b35d4",
                        decimals:18,
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x1cbdaB4f242CCEE0C589d6b2eaD712d1b25A19fA",
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
                        address: "0xf2b8Df84784dC114845BA0b81365D0c7FB831C26",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/defiLogos/multi-collateral-dai-dai-logo.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0xDaa15B55Efe7B276d6eCf299ACFa82e410F961a0",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-WBTC FAV",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x3A939fD1ea1003c7070D43e0285652c15810F3Ed",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});