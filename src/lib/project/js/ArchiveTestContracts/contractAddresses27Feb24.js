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
                        address: "0xd5D7AD7D9e1AA28D6A4F697e96C1Efe6d651aecd",
                        decimals:18,
                        ticker:"FAV-DAI-AWMATIC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-AWMATIC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x1164984bD8754C5eac25a1997Ba53c85Da24F840",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0xABD1Cde537a3D467Ee271eA8F58E3e226529bf49",
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
                        address: "0xBffE183925535b49805C3c3A46EB05879Ca697b0",
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
                        address: "0xC6BC60CF088B6dF94361ff247D389013A7c800ae",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-AWMATIC.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x747BBA778581970469f98F6D3C6428Be48E73fD8",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x4233611d3098774b599b1144A517e3E0179fA2F8",
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
                        address: "0x1b2aE46Bede9e093940EC8101192A441888bFBfe",
                        decimals:18,
                        ticker:"FAV-DAI-WBTC",
                        tokenIcon:"/utilityTokens/FAVStable DAI-WBTC.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x1E564Da30DF9A40a12C31C2BED2D61dae810B674",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0xc321686E0059ae4900f396E6258c1e9c1B8677CA",
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
                        address: "0xBffE183925535b49805C3c3A46EB05879Ca697b0",
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
                        address: "0x65485297fc901B8A8674c1ad60BeC4F64A642D8F",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-WBTC.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x5a802bCf3FD98001170CE53d3855C95c14270756",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim DAI-WBTC.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x7a86d9D4A9ac54Acab7C90E815c4b7F9095DA8ac",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});
  








