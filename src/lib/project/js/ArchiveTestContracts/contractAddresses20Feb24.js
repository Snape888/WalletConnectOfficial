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
                        address: "0xb31cc18e04351DA81B17e6481A42DE746Ff7CdBc",
                        decimals:18,
                        ticker:"FAV-AWMATIC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable AWMATIC-DAI.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0x5b4f7f18b322c906d9D8D335645B6eaC8812102A",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x28E439649860Cb1DD5C6f9CE52972dE4dd821918",
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
                        address: "0xb31cc18e04351DA81B17e6481A42DE746Ff7CdBc",
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
                        address: "0x78e0D6792B532e1Fed61cdB28Ffa2D276784DC34",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x157316FE34Dcfb12b47b08afcd4e1aE6b0271a84",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x5DEe18E0bAb02758cF8720673913D048A4BFE449",
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
                        address: "0x6565E800785e8773375DC5C8Ad28c43B936B6583",
                        decimals:18,
                        ticker:"FAV-WBTC-DAI",
                        tokenIcon:"/utilityTokens/FAVStable WBTC-DAI.svg",
                        lastUpdated: "4/2/24"
                    },  
                    "Mortgage Conversion Vault":{ // based on erc4626 Ingests erc20 deposits manages shares. People can wait until erc20 shares are worth higher than market price
                        alias: "conversion vault address",
                        fileName: "mortgageconversionvault.json",
                        address: "0xa1F2D94b2a470f5a42409D02Eb89786ed540BF0c",
                        lastUpdated: "4/2/24"
                    },
                    "Mortgage Fee Conversion Vault":{
                        alias: "fee conversion vault address",
                        fileName: "mortgagefeeconversionvault.json",
                        address: "0x69Acdb2ab9A1A0dac56d92a9A9e88aE06e68776B",
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
                        address: "0x6565E800785e8773375DC5C8Ad28c43B936B6583",
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
                        address: "0xA278DDdd30b31cD4a5e92d291Da440036d5BD4F9",
                        lastUpdated: "4/2/24",
                        ticker:"DAI-NFT ",
                        tokenIcon:"/utilityTokens/FAVClaim AWMATIC DAI.svg",

                    },
                    "Conversion vault fee Tickets":{ // fee conversion vault
                        alias: "tickets2",
                        fileName: "mortgagefeetickets.json",
                        address: "0x19CBaEa3dA99152B2A6b4D68383133fe7d7813b6",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"/utilityTokens/FAVClaim WBTC-DAI.svg",
                    },
                    "Mortgage contracts":{
                        alias: "contracts address",
                        fileName: "mortgagecontracts.json",
                        address: "0x3F16870bc42d7659187B25056274eA7819d88E58",
                        lastUpdated: "4/2/24",
                        ticker:"",
                        tokenIcon:"",
                    },
                }  
            },

        }
    }
});
  








