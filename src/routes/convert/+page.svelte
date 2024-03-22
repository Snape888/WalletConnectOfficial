<script>
    // Svelte imports
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    // Project specific imports
    import { pages, currentPage, themeColours, roundedCornersSm, roundedCornersLg, dropShadow } from '$lib/project/js/stores/brandAndTheme.ts';
    import { checkAllowances, toWei, fromWei, updateContractAddresses, updateAvailableToRedeem, updateCurrentSelectedDropdowns, executeFunction, updatePricePerCoin } from '$lib/project/js/helpers';
    import mortgageConversionVaultAbi from "$lib/project/abi/mortgageconversionvault.sol/mortgageconversionvault.json";
    import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
    import mortgageFeeConversionVaultAbi from "$lib/project/abi/mortgagefeeconversionvault.sol/mortgagefeeconversionvault.json";

    //on chain-data reads
    import { 
        user,
        chainId,
        swapToken,
        selectedSellableErc20Balance,
        swapRecieveToken,
        selectedSellableErc20VaultSize,
        recievableNFTs,
        redeemableNFTs,
        dropDownSelections,
        depositSwapVaults,
        walletBalances,
        dropDownSelectionsNames,
        contractAddresses,
        FAVSwaperc20DepositAllowance,
        pricePerCoin,
        availableToRedeem,
        txProcessMessage
     } from '$lib/project/js/stores/projectDynamicValues.ts';
    //on-chain data execution
    
    import {
        swapERC20forNFT,
        redeemNFT
    } from '$lib/project/js/FAVfunctionCalls.ts';

    import { 
        getWalletBalances,
    } from '$lib/project/js/helpers';

    // Boilerplate components
    import Block from '$lib/boilerplate/components/Block.svelte';
    import Button from '$lib/boilerplate/components/Button.svelte';
    import TokenSelection from '$lib/boilerplate/components/TokenSelection.svelte';
    import PaymentInputField from '$lib/boilerplate/components/PaymentInputField.svelte';
    import Radio from '$lib/boilerplate/components/Radio.svelte';
    import HelpMessageModal from '$lib/boilerplate/components/HelpMessageModal.svelte';

    import { BigNumber } from "bignumber.js";

    /// Boilerplate Web3 imports
    import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
    import { _round } from "$lib/boilerplate/js/core";
    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";

    let selectedVault = 0;
    let selectedRecieptNFT = 0;
    let selectedRedemptionNFT =0;

    let showSwapTokenSelection = false;

    //$: selectedVault, updateSelectedVaultPrice();

    //Reactive balances of currently selected vaults
    $: depositErc20Balance ="Balance "+ $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVSwapDepositVault]?.tokens["Deposit erc20"]?.balance ?? 'Loading...';

    //Reactive currently selected vaults
    $: erc20DepositToken = $depositSwapVaults && $dropDownSelectionsNames.FAVSwapDepositVault in $depositSwapVaults
    ? $depositSwapVaults[$dropDownSelectionsNames.FAVSwapDepositVault]["Deposit erc20"]?.tokenIcon
    : '';
    $: erc20DepositTokenTicker = $depositSwapVaults && $dropDownSelectionsNames.FAVSwapDepositVault in $depositSwapVaults
    ? $depositSwapVaults[$dropDownSelectionsNames.FAVSwapDepositVault]["Deposit erc20"]?.ticker
    : '...Loading';


    //Reactive currently selected vaults
    // $: stablecoinRecieptToken = $recievableNFTs[$dropDownSelectionsNames.FAVSwapDepositVault]["Stablecoin"].tokenIcon;
    $: stablecoinRecieptToken = $recievableNFTs && $dropDownSelectionsNames.FAVSwapDepositVault in $recievableNFTs
    ? $recievableNFTs[$dropDownSelectionsNames.FAVSwapDepositVault]["Stablecoin"].tokenIcon
    : '';

    $: stablecoinRecieptTokenTicker = $recievableNFTs && $dropDownSelectionsNames.FAVSwapDepositVault in $recievableNFTs
    ? $recievableNFTs[$dropDownSelectionsNames.FAVSwapDepositVault]["Stablecoin"].ticker
    : '...Loading';

    // let pricePerCoin = "Loading...";
    // Reactive price per coin, should change everytime the dropdown selector is used    
    // $: if (Object.keys($walletBalances).length > 0) {
        // console.log("Wallet Balances filled");
        // updatePricePerCoin();
        // console.log("pricePerCoin = ", $pricePerCoin);

    // } 
    
  

   // Function to handle token selection
    function handleSwapTokenSelection() {
        showSwapTokenSelection = false;
    }

    function findVaultById(event) {
        handleSwapTokenSelection();
        
        const selectedVaultId = event.detail;
        console.log("selectedVaultId = ", selectedVaultId);
        console.log("$depositSwapVaults = ", $depositSwapVaults);

        // Find the index of the element with the specified id
        const index = $depositSwapVaults.findIndex(token => token.id === selectedVaultId);

        if (index != -1) {
            selectedVault = index;
            $dropDownSelections.FAVSwapDepositVault = event.detail;
            updateCurrentSelectedDropdowns();
            console.log("FAVSwapDepositVault = ", $dropDownSelectionsNames.FAVSwapDepositVault);

            // Check if the index is higher than the number of vaults
            const isIndexExceeding = index >= Object.keys(mortgageContractsInfo[Number($chainId)].vaults).length;
            updatePricePerCoin($dropDownSelectionsNames.FAVSwapDepositVault, isIndexExceeding);
        }
        checkAllowances();
        console.log("$dropDownSelections.FAVSwapDepositVault = ", $dropDownSelections.FAVSwapDepositVault);
    }

    function selectSwapToken(){
        showSwapTokenSelection = !showSwapTokenSelection;
    };

    ////
    
    let showNFTSelection = false;

    // Function to handle token selection
    function handleRedemptionNFTSelection() {
        showNFTSelection = false;
    }

    function findRedemptiontNFTById(event) {
        handleRedemptionNFTSelection();
        // Convert Svelte store to a regular array
        const selectedRedemptionNFTId = event.detail;

        // Find the index of the element with the specified id
        const index = $redeemableNFTs.findIndex(redemptionNFT => redemptionNFT.id === selectedRedemptionNFTId);

        if (index != -1){
            selectedRedemptionNFT = index;
            $dropDownSelections.FAVSwapRedeemableNFTs = event.detail;
            updateCurrentSelectedDropdowns();
            updateAvailableToRedeem(index);
            // redeemSelection =
        }
        
        // return index; // returns -1 if no element is found
    }

    function selectNFT(){
        showNFTSelection = !showNFTSelection;
    };

    let redeemField = 0;
    // let redeemSelection;

    async function handleRedeem(shares, nftId){
        // let depositAmount = toWei(swapField01, $contractAddresses.depositErc20Decimals);
        const vault = $redeemableNFTs[selectedRedemptionNFT].vaultName; 
        const conversionVaultDecimals = mortgageContractsInfo[Number($chainId)].vaults[vault].coreContracts["Mortgage Conversion Vault"].decimals;
        const erc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[vault].tokens["Deposit erc20"].decimals;
        const mortgageConversionVaultContract = mortgageContractsInfo[Number($chainId)].vaults[vault].coreContracts["Mortgage Conversion Vault"].address;


        console.log("handleRedeem shares = ", shares);
        console.log("Type of shares:", typeof shares, "Value of shares:", shares);
        console.log("Decimals:", conversionVaultDecimals);
        console.log("handleRedeem shares toWei = ", toWei(String(shares), conversionVaultDecimals));
        console.log("handleRedeem selectedRedemptionNFT = ", selectedRedemptionNFT);
        console.log("handleRedeem $redeemableNFTs[selectedRedemptionNFT].vault = ", $redeemableNFTs[selectedRedemptionNFT].vaultName);

        let redeemAmount = toWei(shares, erc20Decimals);
        const args = [
            redeemAmount, //shares
            $user, //reciever
            $user, //owner
            nftId, // selected NFT id
        ];
        // console.log("amount to redeem = ", redeemAmount);
        // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
        // Call executeFunction with the retrieved values
        let result = await executeFunction(mortgageConversionVaultContract, mortgageConversionVaultAbi, "redeem", args);

        if (result) {
            console.log("Transaction successful");
            updateAvailableToRedeem($redeemableNFTs[selectedRedemptionNFT].id);
            $txProcessMessage = false;
            // Additional logic on success
        } else {
            console.error("Transaction failed");
            $txProcessMessage = false;
            // Additional logic on failure
        }
    }

    ///Help modal -------------------------------------------------------------

    let helpModals = {
        chooseERC20: false,
        chooseRecieptToken: false,
        chooseNFT: false,
        redeemAmount: false,
    }

    function toggleHelp(modalName){
        helpModals[modalName] = !helpModals[modalName];
    }

    ///End of Help modal ------------------------------------------------------

    async function handleSwap(swapApproveToggle) {

        let contractName;
        let swapToken;
        let convertAbi;

        console.log("handleSwap: $dropDownSelections.FAVSwapDepositVault = ", $dropDownSelections.FAVSwapDepositVault, " Object.keys(mortgageContractsInfo[$chainId]?.vaults).length = ", Object.keys(mortgageContractsInfo[Number($chainId)]?.vaults).length);
        //determine if FAV token is being swapped
        if($dropDownSelections.FAVSwapDepositVault > (Object.keys(mortgageContractsInfo[Number($chainId)]?.vaults).length-1)){
            console.log("handleSwap FAV token swap detected");
            // const vaultChild = coreContracts;
            contractName = "Mortgage Fee Conversion Vault";
            swapToken = "Mortgage Synth";
            convertAbi = mortgageConversionVaultAbi;
        }else{
            console.log("handleSwap FAV token swap NOT detected");
            // const vaultChild = tokens;
            contractName = "Mortgage Conversion Vault";
            swapToken = "Deposit erc20";
            convertAbi = mortgageFeeConversionVaultAbi;
        }
        
        console.log("Swap block submitted");
        console.log("mortgageConversionVaultAbi = ", mortgageConversionVaultAbi);

        // get the mortgage and erc20 contract addresses of the currently selected vault/dropdown
        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVSwapDepositVault].coreContracts[contractName].address;
        const depositTokenContract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVSwapDepositVault].tokens[swapToken].address;
        const depositTokenDecimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVSwapDepositVault].tokens[swapToken].decimals;
        
        
        updateContractAddresses();
        if (swapApproveToggle== "Approve"){
            console.log("Handle swap: Run Approve function");
            // console.log("Handle swap: contract addresses = ", $contractAddresses);
            // console.log("Handle swap: swapField01 ", swapField01);


            let approveAmount = toWei(swapField01, depositTokenDecimals);
            const args = [contract, approveAmount];

            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction(depositTokenContract, erc20Abi, "approve", args);

            if (result) {
                console.log("Transaction successful");
                checkAllowances();
                $txProcessMessage = false;
                // Additional logic on success
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }

        } else if (swapApproveToggle== "Swap") {
            console.log("Run Swap function");
            console.log("contract addresses = ", $contractAddresses);
            console.log("token decimals = ", $contractAddresses.depositErc20Decimals);
            console.log("mortgageConversionVaultAbi = ", mortgageConversionVaultAbi);
            

            // let depositAmount = toWei(swapField01, $contractAddresses.depositErc20Decimals);
            let swapAmount = toWei(swapField01, depositTokenDecimals);
            const args = [swapAmount, $user];
            console.log("amount to swap = ", swapField01);
            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction(contract, convertAbi, "deposit", args);

            if (result) {
                console.log("Transaction successful");
                await getWalletBalances();
                checkAllowances();
                // Additional logic on success
            } else {
                console.error("Transaction failed");
                // Additional logic on failure
            }
        }


           
    }


    let swapField01 = 0;
    let depositErc20ButtonLabel = 'Swap'; // Initialize the button label

    // Reactive statement to update the button label
    $: if ($FAVSwaperc20DepositAllowance !== null && swapField01 > Number($FAVSwaperc20DepositAllowance)) {
        console.log("FAVSwaperc20DepositAllowance = ", $FAVSwaperc20DepositAllowance," swapField01 = ", swapField01);
        depositErc20ButtonLabel = 'Approve';
    } else {
        depositErc20ButtonLabel = 'Swap';
    }



    function handleSwapFieldInput(event) {
        console.log("handleSwapFieldInput: input = ", event.detail );
        swapField01 = event.detail;
        //checkAllowances(); 
    }

    function handleRedeemFieldInput(event) {
        redeemField = event.detail;
        console.log("handleRedeemFieldInput = ", redeemField);
        // checkAllowances(); 
        redemptionRecievePreview();
    }

    /// Match balance
    function matchBalance(event) {
        redeemField = event.detail;
        redemptionRecievePreview();
        console.log("matchBalance redeemField = ", redeemField);

    }

    let recievePreview = 0;
    function redemptionRecievePreview(){  
            
        recievePreview = Number($pricePerCoin)*redeemField;
        console.log(recievePreview);  

    }
    let swapTokenBalance;
    function updateSwapTokenBalance(){
        let _tempBalance = 0;
        // if tokenSelection ticker does not equal FAV
        if ($redeemableNFTs($dropDownSelections.FAVSwapDepositVault).ticker != "FAV"){
            _tempBalance = $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVSwapDepositVault]?.tokens[$depositSwapVaults[selectedVault].name]?.balance || "Loading...";
        }else{
            _tempBalance = $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVSwapDepositVault]?.tokens[$depositSwapVaults[selectedVault].name]?.balance || "Loading...";
        }
        
        swapTokenBalance = "Balance " + _tempBalance;
    }

</script>

<HelpMessageModal
    visible={helpModals['chooseERC20']} 
    helperName="chooseERC20"
    titleCopy="Choose your ERC20"
    bodyCopy01="This dropdown list will display all the ERC20 tokens FAV is currently accepting. <br>If you would like to see new ERC20's added, please contact the team in our discord."
    url01="https://discord.gg/FqBDBF99"
    url01Name="Join our Discord"
    on:close={() => toggleHelp('chooseERC20')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['chooseRecieptToken']} 
    helperName="chooseRecieptToken"
    titleCopy="Choose your ERC20 payment token"
    bodyCopy01="This dropdown list will display all the FAV stablecoins currently available for the vault selected above. <br>You will recieve an NFT that can be redeemed for the stablecoin you have selected after a 72 hr cooldown period.<br> The cooldown period is neccessary to avoid vault manipulation."
    on:close={() => toggleHelp('chooseRecieptToken')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['chooseNFT']} 
    helperName="chooseNFT"
    titleCopy="Choose your ERC20 payment token"
    bodyCopy01="This dropdown list will display all your NFTs eligible to be redeemed. <br>The value in approximate value per unit per is displayed in USD terms in grey text."
    on:close={() => toggleHelp('chooseNFT')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['redeemAmount']} 
    helperName="redeemAmount"
    titleCopy="Redeem all or part of your selected NFT"
    bodyCopy01="Input the units of your selected NFT you would like to redeem. <br>Hitting the MAX button will allow you to redeem your NFT's full value."
    on:close={() => toggleHelp('redeemAmount')}     
></HelpMessageModal>

<TokenSelection visible={showSwapTokenSelection} 
    tokenList={$depositSwapVaults}
    title="Select token to swap"
    on:tokenSelected={findVaultById}  
></TokenSelection>

<TokenSelection visible={showNFTSelection} 
    tokenList={$redeemableNFTs}
    title="Select your NFT"
    on:tokenSelected={findRedemptiontNFTById}  
></TokenSelection>

<div transition:slide class="flex flex-col justify-center items-center space-y-10 w-full">
<!-- sell us your ERC20 -->
    <div class="pageSection1 text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px]">
        <div class="pageTitleBlock">
            <div class="sectionHeader flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
                <div class="leftHandGroup w-20 py-5">
                        <!-- Light Mode Image -->
                        <img src="/FAVLogos/FAV SWAPS.svg" 
                        alt="FAV Loans logo" 
                        class="dark:hidden" />
               
                        <!-- Dark Mode Image -->
                        <img src="/FAVLogos/FAV SWAPS rev.svg" 
                        alt="FAV Loans logo" 
                        class="hidden dark:block" />
                </div>
                <div class="rightHandGroup w-12">            
                </div>
            </div>
            <div class="sectionSubHeader  flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
                <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                    <span>Sell us your ERC20 for above the market price</span>
                </div>
                <div class="rightHandGroup">
                    <Button 
                    cornerRadius={$roundedCornersSm}
                    textColor={false}
                    font={false}
                    textSize="text-xs"
                    border="border"
                    paddingX={false}
                    paddingY="py-1.5"
                    backgroundColor="bg-whitePrim-light dark:bg-whitePrim-dark"
                    borderColor={false} 
                    type="button"
                    >
                    <span>Learn more</span>
                </Button>
                </div>
            </div>
            <div class="sectionCopy flex px-3 py-2 w-full min-w-[200px] max-w-[600px] justify-between items-center">
                <div class="leftHandGroup font-BarlowLight text-xs">
                    <span>Use the token selector below to check the offered purchase for your ERC20 tokens. Any valuations higher than market value offer you an arbitrage opportunity.
                        Upon selling FAV your tokens you will receive an NFT that represents the value of your sale. This NFT enforces a 72hr cooldown period before it be redeemed for the stablecoin.
                    </span>
                </div>
                <div class="rightHandGroup">
                    
                </div>
            </div>
        </div>
        
        <Block
            pagination={false}
            borderColor={false}
            >
            {#if $depositSwapVaults && $depositSwapVaults.length > selectedVault && $depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].tokenIcon}
            <form on:submit|preventDefault={async (event) => {
                // Prevent the form from submitting traditionally
                event.preventDefault();
                // Call your async function here
                await handleSwap(depositErc20ButtonLabel);
              }}>
                <div class="sellERC20Content">
                    <div class="upperTitle flex w-full px-3 justify-between items-center">
                        <div class="leftHandGroup text-sm">
                            Choose which token you'd like to sell to FAV
            
                        </div>
                        <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('chooseERC20')}>
                            <!-- Light Mode Image -->
                            <img src="/artwork/HelpIcon.svg" 
                            alt="Help Icon" 
                            class="dark:hidden" />
                
                            <!-- Dark Mode Image -->
                            <img src="/artwork/HelpIcon-D.svg" 
                            alt="Help Icon" 
                            class="hidden dark:block" />
                        </button>
                    </div>
                    
                    <PaymentInputField 
                        on:dropDownClicked={() => selectSwapToken()}
                        on:input={handleSwapFieldInput}
                        on:autoFillClicked={() => handleSwapFieldInput}

            
                        textColor={false}    
                        cornerRadius={$roundedCornersSm}
            
                        tokenSelection={true}
                        token={$depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].tokenIcon}
                        textLabel={$depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].ticker}
                        dropDownArrow={true}
            
                        leftFooterText={true}
                        leftFooterTextLabel={"Balance "+ $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVSwapDepositVault]?.tokens[$depositSwapVaults[selectedVault].name]?.balance || "Loading..."}
                        
                        
                        inputField={true} 
                        bind:value={swapField01}
                        inputPlaceholderValue = {0}
                        
                        rightFooterText={true}
                        rightFooterTextLabel="MAX">
            
                    </PaymentInputField>
                    
                    <div class="upperTitle flex w-full px-3 text-blackPrim justify-between items-center">
                        <div class="leftHandGroup text-sm">
                            You'll recieve an NFT that you can redeem for this stablecoin as payment
            
                        </div>
                        <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('chooseRecieptToken')}>
                            <!-- Light Mode Image -->
                            <img src="/artwork/HelpIcon.svg" 
                            alt="Help Icon" 
                            class="dark:hidden" />
                
                            <!-- Dark Mode Image -->
                            <img src="/artwork/HelpIcon-D.svg" 
                            alt="Help Icon" 
                            class="hidden dark:block" />
                        </button>
                    </div>
                    
                    <PaymentInputField 
            
                        textColor={false}     
                        cornerRadius={$roundedCornersSm}
            
                        tokenSelection={true}
                        token={$depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].stablecoinIcon}
                        textLabel={$depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].available+" "+$depositSwapVaults[$dropDownSelections.FAVSwapDepositVault].ticker + " NFT"}
            
                        leftFooterText={false} 
                        leftFooterTextLabel="" 
            
                        inputField={true}
                        value={_round(swapField01*Number($pricePerCoin), 7)}
                        inputDisabled={true}
            
                        rightFooterText={true}
                        rightFooterTextLabel={"Exchange rate ~$" + _round($pricePerCoin,7)}  
                        disableRightFooterClick={true}
                        >
                    </PaymentInputField>
                    
            
                    <div class="loanTechDetails px-3 font-BarlowRegular text-blackPrim text-sm">
                        <div class="tokensAvailable"></div>
                    </div>
                    <div class="createLoan flex justify-center items-cente p-3">
                        <Button 
    
                            cornerRadius={$roundedCornersSm} 
                            textColor="text-whitePrim-light"

                            font={false}
                            textSize="text-sm"
                            border={false}
                            paddingX="px-4"
                            paddingY="py-1.5"
                            backgroundColor={false}
                            borderColor={false}   
                            type="Submit"   
                            >
                            <span>{depositErc20ButtonLabel}</span>
                        </Button>
                    </div>
                </div>
            </form>
            {:else}
            Loading...
            {/if}
        </Block>
    </div>

    <!-- redeem NFT -->
    <div id="pendingConversions" class="pageSection2 text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px]">    
        <div class="pageTitleBlock">

            <div class="sectionSubHeader flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
                <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                    <span>Redeem</span>
                </div>
                <div class="rightHandGroup">
                    <Button 
                    cornerRadius={$roundedCornersSm}
                    textColor={false}
                    font={false}
                    textSize="text-xs"
                    border="border"
                    paddingX={false}
                    paddingY="py-1.5"
                    backgroundColor="bg-whitePrim-light dark:bg-whitePrim-dark"
                    borderColor={false}
                    type="button"
                    >
                    <span>Learn more</span>
                </Button>
                </div>
            </div>
            <div class="sectionCopy flex px-3  py-2 w-full min-w-[200px] max-w-[600px] justify-between items-center">
                <div class="leftHandGroup  font-BarlowLight text-xs">
                    <span>Redeem any of your stable-NFTs once their cooldown timers have finished.
                    </span>
                </div>
                <div class="rightHandGroup">
                    
                </div>
            </div>
        </div>
        
        <Block
            pagination={false}
            borderColor={false}
            >
            {#if Object.keys($redeemableNFTs).length > 0}
                <div class="upperTitle flex w-full px-3 justify-between  items-center">
                    <div class="leftHandGroup text-sm">
                        Select your NFT or FAV token to redeem
        
                    </div>
                    <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('chooseNFT')}>
                        <!-- Light Mode Image -->
                        <img src="/artwork/HelpIcon.svg" 
                        alt="Help Icon" 
                        class="dark:hidden" />
            
                        <!-- Dark Mode Image -->
                        <img src="/artwork/HelpIcon-D.svg" 
                        alt="Help Icon" 
                        class="hidden dark:block" />
                    </button>
                </div>
                <div class="redemNFTContent">
                    <PaymentInputField 
                        on:dropDownClicked={() => selectNFT()}
                        on:input={handleRedeemFieldInput}
                        on:autoFillClicked={matchBalance}
                        
                        textColor={false}     
                        cornerRadius={$roundedCornersSm} 
                        
                        tokenSelection={true}
                        token={$redeemableNFTs[selectedRedemptionNFT]?.tokenIcon || ''}
                        textLabel={$redeemableNFTs[selectedRedemptionNFT]?.ticker || '...Loading'}    
                        dropDownArrow={true}

                        leftFooterText={true}
                        leftFooterTextLabel="Balance {$redeemableNFTs[$dropDownSelections.FAVSwapRedeemableNFTs].amountSold}"

                        inputField={true}
                        bind:value={redeemField}
                        inputPlaceholderValue = {0}

                        rightFooterText={true}
                        rightFooterTextLabel="MAX">
                    
                    </PaymentInputField>

                    <div class="loanTechDetails px-3 font-BarlowRegular  text-sm">
                        <div class="tokensAvailable">You will receive: <span class="font-BarlowBold">{_round(recievePreview, 7)} {$redeemableNFTs[selectedRedemptionNFT].stablecoin}</span></div>
                        
                    </div>
                <div id="redeemButton" class="flex justify-center items-cente p-3">
                        <Button 
                            on:buttonClicked={() => handleRedeem(redeemField, $redeemableNFTs[$dropDownSelections.FAVSwapRedeemableNFTs].nftId)}
                            cornerRadius={$roundedCornersSm} 
                            textColor="text-whitePrim-light"
                            
                            font={false}
                            textSize="text-sm"
                            border={false}
                            paddingX="px-4"
                            paddingY="py-1.5"
                            backgroundColor={false}
                            borderColor={false} 
                            type="button"
                            >
                            <span>Redeem</span>
                        </Button>
                    </div>
                </div>

            {:else}
            No NFT balances detected yet...
            {/if}
        </Block>
    </div>


</div>


