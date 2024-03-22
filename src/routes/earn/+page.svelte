<script lang="ts">
    
    // Svelte imports
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    // Project specific imports
    import { roundedCornersSm } from '$lib/project/js/stores/brandAndTheme.ts';

    /// Project Web3 imports
    import { 
        transfer,
        executeFunction,
        getSubStringAfterDash,
        getSubStringBeforeDash,
        updateContractAddresses,
        checkAllowances,
        findVaultIdentifierByIndex,
        updateCurrentSelectedDropdowns,
        toWei,
        fromWei,

        getWalletBalances

        } from "$lib/project/js/helpers.ts";

    import { createExchangeDepositsVaultsArray, getPreviewStatsForEarnDeposit } from  "$lib/project/js/FAVfunctionCalls.ts";    

    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
    import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
    
    

    /// Boilerplate Web3 imports
    import { _round } from "$lib/boilerplate/js/core";
    import erc20Abi from "$lib/boilerplate/abi/erc-20.json";


    //on chain-data reads
    import { 
        user,
        chainId,
        depositVaults,
        selectedFAVstableBalance,
        selectedFAVVaultUtilisation,
        selectedFAVVaultSize,
        exchangableFAVStables,
        selectedFAVstableBurnBalance,
        redeemableIOUBalances,
        selectedVaultRedemptionSupply,
        userBalances,
        dropDownSelections,
        dropDownSelectionsNames,
        FAVEarnStablecoinDepositAllowance,
        contractAddresses,
        walletBalances,
        exchangeDepositVaults,
        earnVaultSummary,
        txProcessMessage,
        connectedAndSupported
    } from '$lib/project/js/stores/projectDynamicValues.ts';

    


    //on-chain data execution
    import {
        depositERC20,
        exchangeFAVStables,
        redeemIOU,
        createRedeemableIOUsArray
    } from '$lib/project/js/FAVfunctionCalls.ts';
    
    // Boilerplate Components
    import Block from '$lib/boilerplate/components/Block.svelte';
    import Button from '$lib/boilerplate/components/Button.svelte';
    import TokenSelection from '$lib/boilerplate/components/TokenSelection.svelte';
    import PaymentInputField from '$lib/boilerplate/components/PaymentInputField.svelte';
    import Radio from '$lib/boilerplate/components/Radio.svelte';
    import HelpMessageModal from '$lib/boilerplate/components/HelpMessageModal.svelte';


    
    /// Web3 functions ---------------------------------------------------------  

    onMount(async () => {
        updateCurrentSelectedDropdowns();
    });

    

    let selectedVault = 0;
    let selectedFAVStable = 0;
    let selectedIOU = 0;
    let redeemField01 = 0;

    let selectedVaultName;
    let selectedFAVStableName = 0;
    let selectedIOUName = 0;

    //Reactive balances of currently selected vaults
    $: FAVstableBalance ="Balance "+ $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVEarnDepositVault]?.tokens["Mortgage Pool"]?.balance ?? 'Loading...';
    $: depositStableBalance ="Balance "+ $walletBalances[Number($chainId)]?.vaults[$dropDownSelectionsNames.FAVEarnDepositVault]?.tokens["Stablecoin"]?.balance ?? 'Loading...';


    // Function to handle token selection
    function handleVaultSelection() {
        showDepositVaultSelection = false;

    }

    function findVaultById(event) {
        handleVaultSelection();
        // Convert Svelte store to a regular array
        const depositVaultsArray = $depositVaults;
        const selectedVaultId = event.detail;

        // Find the index of the element with the specified id
        const index = depositVaultsArray.findIndex(token => token.id === selectedVaultId);

        if (index != -1){
            selectedVault = index;
            $dropDownSelections.FAVEarnDepositVault = event.detail;
            updateCurrentSelectedDropdowns();
        }
        checkAllowances();
        getPreviewStatsForEarnDeposit();
        // return index; // returns -1 if no element is found
    }

     // Function to handle token selection
     function handleFAVStableSelection() {
        showFAVStablesSelection = false;

    }

    function findFAVStableById(event) {
        handleFAVStableSelection();
        // Convert Svelte store to a regular array
        const FAVStableArray = $exchangeDepositVaults;
        const selectedFAVStableId = event.detail;
        console.log("event.detail = ", event.detail);

        // Find the index of the element with the specified id
        const index = FAVStableArray.findIndex(FAVStable => FAVStable.id === selectedFAVStableId);

        if (index != -1){
            selectedFAVStable = index;
            $dropDownSelections.FAVEarnExchangeStable = event.detail;
            updateCurrentSelectedDropdowns();
            // selectedFAVStable = 1;
        }
        
        // return index; // returns -1 if no element is found
    }

     // Function to handle token selection
     function handleIOUSelection() {
        showIOUSelection = false;

    }

    function findIOUById(event) {
        handleIOUSelection();
        // Convert Svelte store to a regular array
        const IOUArray = $redeemableIOUBalances;
        const IOUId = event.detail;

        // Find the index of the element with the specified id
        const index = IOUArray.findIndex(IOU => IOU.id === IOUId);

        if (index != -1){
            selectedIOU = index;
            $dropDownSelections.FAVEarnRedeemIOU = event.detail;
            updateCurrentSelectedDropdowns();
        }

    }

    let showDepositVaultSelection = false;

    function selectDepositVault(){
        showDepositVaultSelection = !showDepositVaultSelection;
    };

    ////

    let showFAVStablesSelection = false;

    function selectFAVStableToken(){
        showFAVStablesSelection = !showFAVStablesSelection;
    };


    ////

    let showIOUSelection = false;

    function selectIOU(){
        showIOUSelection = !showIOUSelection;
    };

        ///Help modal -------------------------------------------------------------

    let helpModals = {
        chooseDepositVault: false,
        chooseRecieptToken: false,
        chooseExchangeToken: false,
        recieveIOU: false,
        selectIOU: false,
        availableForRedemption: false,
    }

    function toggleHelp(modalName){
        helpModals[modalName] = !helpModals[modalName];
    }

    ///End of Help modal ------------------------------------------------------

    /// Dynamic vault related functions
    // Computed values for use in the template
    let tokenAfterDash;
    let userBalance;
    let formattedBalanceA;
    let formattedBalanceB;




    let depositField01: number | null = null;
    let exchangeField01: number | null = null;

    let stablesDepositButtonLabel = 'Deposit'; // Initialize the button label

    // Reactive statement to update the button label
    $: if ($FAVEarnStablecoinDepositAllowance !== null && Number(depositField01) > Number($FAVEarnStablecoinDepositAllowance)) {
        stablesDepositButtonLabel = 'Approve';
    } else {
        stablesDepositButtonLabel = 'Deposit';
    }

    /// Match balance
     async function matchBalance(fieldAlias, balance) {
        if (fieldAlias === "depositField01") {
            depositField01 = balance;
        }else if(fieldAlias === "exchangeField01"){
            exchangeField01 = balance;
        }
        //await checkAllowances();

    }

    async function handleDepositFieldInput(event) {
        depositField01 = event.detail;
        //await checkAllowances();
    }

    async function handleExchangeFieldInput(event) {
        exchangeField01 = event.detail;
        createExchangeDepositsVaultsArray();
        //await checkAllowances();
    }

    async function handleDeposit(depositApproveToggle) {

        // console.log("mortgagePoolContractAbi = ", mortgagePoolContractAbi);

        // get the mortgage and stablecoin contract addresses of the currently selected vault/dropdown
        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVEarnDepositVault].coreContracts["Mortgage Pool"].address;
        const stablecoinContract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVEarnDepositVault].tokens["Stablecoin"].address;
        
        
        updateContractAddresses();
        if (depositApproveToggle== "Approve"){
            console.log("Run Approve function");
            console.log("contract addresses = ", $contractAddresses);
            
            let approveAmount = toWei(depositField01, $contractAddresses.stablecoinDecimals);
            const args = [contract, approveAmount];

            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction(stablecoinContract, erc20Abi, "approve", args);

            if (result) {
                await checkAllowances();
                $walletBalances = await getWalletBalances();
                createExchangeDepositsVaultsArray();
                console.log("Transaction successful");
                $txProcessMessage = false;
                // Additional logic on success
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }

        } else if (depositApproveToggle== "Deposit") {
            console.log("Run Deposit function");
            console.log("contract addresses = ", $contractAddresses);
            console.log("token decimals = ", $contractAddresses.stablecoinDecimals);
            
            let depositAmount = toWei(depositField01, $contractAddresses.stablecoinDecimals);
            const args = [$user, depositAmount];
            console.log("amount to deposit = ", depositAmount);
            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction(contract, mortgagePoolContractAbi, "deposit", args);

            if (result) {
                await checkAllowances();
                $walletBalances = await getWalletBalances();
                createExchangeDepositsVaultsArray();
                console.log("Transaction successful");
                $txProcessMessage = false;
                // Additional logic on success
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        }

           
    }

    async function handleExchange() {

        // console.log("mortgagePoolContractAbi = ", mortgagePoolContractAbi);

        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVEarnExchangeStable].coreContracts["Mortgage Pool"].address;
        const stablecoinDecimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVEarnDepositVault].tokens["Stablecoin"].decimals;
        
        updateContractAddresses();

            console.log("Run burnToGetOutInLine (exchange) function");
            console.log("contract addresses = ", contract);
            console.log("token decimals = ", stablecoinDecimals);
            

            let depositAmount = toWei(exchangeField01, stablecoinDecimals);
            const args = [depositAmount];
            console.log("amount to deposit = ", depositAmount);
            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction($contractAddresses.mortgagePoolAddress, mortgagePoolContractAbi, "burnToGetOutInLine", args);

            if (result) {
                await checkAllowances();
                $walletBalances = await getWalletBalances();
                createRedeemableIOUsArray();
                console.log("Transaction successful");
                $txProcessMessage = false;
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        


           
    }
    async function handleRedeem() {
        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVEarnRedeemIOU].coreContracts["Mortgage Pool"].address;
        // console.log("mortgagePoolContractAbi = ", mortgagePoolContractAbi);

        updateContractAddresses();

        console.log("Run burnToGetOutInLine (exchange) function");
        console.log("contract addresses = ", $contractAddresses);
        console.log("token decimals = ", $contractAddresses.stablecoinDecimals);
        

        let size = toWei(redeemField01, $contractAddresses.stablecoinDecimals);            
        const args = [size];
        console.log("handleRedeem: size = ", size);
        // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
        // Call executeFunction with the retrieved values
        let result = await executeFunction(contract, mortgagePoolContractAbi, "fromLineToWallet", args);

        if (result) {
            await getWalletBalances();
            console.log("Transaction successful");
            $txProcessMessage = false;
            // Additional logic on success
        } else {
            console.error("Transaction failed");
            $txProcessMessage = false;
            // Additional logic on failure
        }

    
    }

    

</script>



<TokenSelection visible={showDepositVaultSelection} 
    tokenList={$depositVaults}
    title="Select token to swap"
    on:tokenSelected={findVaultById}  
></TokenSelection>

<TokenSelection visible={showFAVStablesSelection} 
    tokenList={$exchangeDepositVaults}
    title="Select FAV stables to exchange"
    on:tokenSelected={findFAVStableById}  
></TokenSelection>

<TokenSelection visible={showIOUSelection} 
    tokenList={$redeemableIOUBalances}
    title="Select NFT to recieve"
    on:tokenSelected={findIOUById}  
></TokenSelection>



<HelpMessageModal
    visible={helpModals['chooseDepositVault']} 
    helperName="chooseDepositVault"
    titleCopy="Choose your deposit vault"
    bodyCopy01="This dropdown will display all the available lending vaults on the current network. The vault name indicates the borrowbale asset and paired stablecoin.<br>Hitting the MAX button will allow you to deposit your full balance."
    on:close={() => toggleHelp('chooseDepositVault')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['chooseRecieptToken']} 
    helperName="chooseRecieptToken"
    titleCopy="FAV Stablecoins you will recieve"
    bodyCopy01="You will recieve an equal amount of FAV Stables to match the amount of stablecoins you deposit."
    on:close={() => toggleHelp('chooseRecieptToken')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['chooseExchangeToken']} 
    helperName="chooseExchangeToken"
    titleCopy="FAV Stables you want to exchange"
    bodyCopy01="Input the units of the selected FAV Stablecoin you would like to exchange. <br>Hitting the MAX button will allow you to exchange your full balance."
    on:close={() => toggleHelp('chooseExchangeToken')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['recieveIOU']} 
    helperName="recieveIOU"
    titleCopy="Amount of IOUs you recieve"
    bodyCopy01="You will recieve an equal amount of units in IOUs as FAV Stables you exchange.<br> You will be able to redeem the IOU for stablecoins."
    on:close={() => toggleHelp('recieveIOU')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['selectIOU']} 
    helperName="selectIOU"
    titleCopy="IOU you want to redeem"
    bodyCopy01="Input the units of the selected IOU you would like to redeem. <br>Hitting the MAX button will allow you to redeem all of your IOUs."
    on:close={() => toggleHelp('selectIOU')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['availableForRedemption']} 
    helperName="availableForRedemption"
    titleCopy="Stablecoins available for redemption"
    bodyCopy01="Below the dropdown states how much is currently available in the selected stablecoin pool for redemption. This amount grows as FAV Earn protocol fees accrue into the pool.<br>Change the dropdown selection to see the available balances of other stablecoins available."
    on:close={() => toggleHelp('availableForRedemption')}     
></HelpMessageModal>


<div transition:slide class="flex flex-col justify-center items-center space-y-10 w-full">
<!-- deposit stablecoins -->
    <div class="pageTitleBlock w-full min-w-[200px] max-w-[600px]">
        <div class="sectionHeader flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup w-20 py-5">
                <!-- Light Mode Image -->
                <img src="/FAVLogos/FAV EARN.svg" 
                alt="FAV Loans logo" 
                class="dark:hidden" />
        
                <!-- Dark Mode Image -->
                <img src="/FAVLogos/FAV EARN rev.svg" 
                alt="FAV Loans logo" 
                class="hidden dark:block" />
            </div>
            <div class="rightHandGroup w-12">            
            </div>
        </div>
        <div class="sectionSubHeader text-blackPrim-light dark:text-blackPrim-dark flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                <span>Make a deposit and start earning rewards</span>
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
        <div class="sectionCopy flex px-3 text-blackPrim-light dark:text-blackPrim-dark py-2 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowLight text-xs">
                <span>Upon depositing into a vault you will receive automatically rebasing FAV stablecoins that grow while you hold them. 
                    There’s no need to claim rewards due the auto-rebasing mechanism.
                </span>
            </div>
            <div class="rightHandGroup">
                
            </div>
        </div>
        
        <Block 
            pagination={false}
            borderColor={false}
            >
            <form id="depositStablcoinsForm" on:submit|preventDefault={async (event) => {
                // Prevent the form from submitting traditionally
                event.preventDefault();
                // Call your async function here
                await handleDeposit(stablesDepositButtonLabel);
                }}>            
                <div class="depositContent">
                    <div class="upperTitle text-blackPrim-light dark:text-blackPrim-dark flex w-full px-3 justify-between items-center">
                        <div class="leftHandGroup text-sm font-BarlowRegular">
                            Choose a vault to deposit your stablecoin into
        
                        </div>
                        <div class="rightHandGroup w-3">
                            <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('chooseDepositVault')}>
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
                    </div>
                    {#if $depositVaults && $depositVaults.length > selectedVault && $depositVaults[$dropDownSelections.FAVEarnDepositVault].tokenIcon}
                        <PaymentInputField 
                            on:dropDownClicked={() => selectDepositVault()}
                            on:autoFillClicked={(event) => matchBalance("depositField01", event.detail)}
                            on:input={handleDepositFieldInput}

                            textColor={false}
                            cornerRadius={$roundedCornersSm} 
                            tokenSelection={true}
                            token={$depositVaults[$dropDownSelections.FAVEarnDepositVault].tokenIcon}
                            textLabel={$depositVaults[$dropDownSelections.FAVEarnDepositVault].ticker}
                            dropDownArrow={true}
                            leftFooterText={true}
                            leftFooterTextLabel={depositStableBalance}
                            inputField={true}
                            inputPlaceholderValue={0}
                            rightFooterText={true}
                            rightFooterTextLabel="MAX"

                        ></PaymentInputField>
                    {/if}
                    <div class="upperTitle flex text-blackPrim-light dark:text-blackPrim-dark w-full px-3 justify-between items-center">
                        <div class="leftHandGroup text-sm font-BarlowRegular">
                            You will recieve
        
                        </div>
                        <div class="rightHandGroup w-3">
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
                    </div>
                    {#if $depositVaults && $depositVaults.length > selectedVault && $depositVaults[selectedVault].tokenIcon}
                    <PaymentInputField
                        

                        textColor={false}
                        cornerRadius={$roundedCornersSm}

                        tokenSelection={true}
                        token={mortgageContractsInfo[Number($chainId)].vaults[$depositVaults[selectedVault].ticker].coreContracts["Mortgage Pool"].tokenIcon}
            
                        textLabel="{$depositVaults[selectedVault].ticker} Stablecoin"
                        dropDownArrow={false}

                        leftFooterText={false}
                        leftFooterTextLabel={""}

                        inputField={true}
                        bind:value={depositField01}
                        inputDisabled={true}
                        inputPlaceholderValue={0}
                        rightFooterText={false}
                        rightFooterTextLabel=""
                    
                    ></PaymentInputField>
                    {/if}
                    {#if $earnVaultSummary}
                    <div class="loanTechDetails px-3 text-blackPrim-light dark:text-blackPrim-dark font-BarlowRegular text-xs">
                        <div class="tokensAvailable">Current system APR: <span class="font-BarlowBold"> {$earnVaultSummary.APR ?? "Calculating "}%</span></div>
                        <div class="poolUtilisation">Utilisation: <span class="font-BarlowBold">{(Number($earnVaultSummary.poolUtilisation))/100 ?? "Calculating "}%</span></div>
                        <div class="disclaimer">Total supply: <span class="font-BarlowBold">{_round($earnVaultSummary.totalSupply, 7) ?? "Calculating..."}</span></div>
                    </div>
                    {/if}
                <div class="burnStables flex justify-center items-center">
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
                            
                            ><span>{stablesDepositButtonLabel}</span>
                        </Button>
                    </div>
                </div>
            </form>
    
        </Block>
    </div>

    
    <!-- exchange fav stables -->
    <div id="vaults" class="pageTitleBlock w-full min-w-[200px] max-w-[600px]">

        <div class="sectionSubHeader text-blackPrim-light dark:text-blackPrim-dark flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                <span>Exchange FAV stables for a redeemable IOU</span>
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
        <div class="sectionCopy flex px-3 py-2 w-full min-w-[200px] max-w-[600px] text-blackPrim-light dark:text-blackPrim-dark justify-between items-center">
            <div class="leftHandGroup font-BarlowLight text-xs">
                <span>Burning FAV stable tokens will top up your IOUs balance. This can be redeemed as protocol fees are accrued.
                </span>
            </div>
            <div class="rightHandGroup">
                
            </div>
        </div>

        <Block 
            pagination={false}
            borderColor={false}
            >
            <!-- <form id="depositStablcoinsForm" on:submit|preventDefault={handleExchange02()}> -->
                <div class="exchangeStablesContent">
                    <div class="upperTitle flex w-full px-3 text-blackPrim-light dark:text-blackPrim-dark justify-between items-center">
                        <div class="leftHandGroup text-sm  font-BarlowRegular">
                            Choose which FAV stables you would like to exchange
        
                        </div>
                        <div class="rightHandGroup w-3">
                            <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('chooseExchangeToken')}>
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
                    </div>
                    {#if $exchangeDepositVaults && $exchangeDepositVaults.length > selectedFAVStable && $exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].tokenIcon}
                    <PaymentInputField 
                        on:dropDownClicked={() => selectFAVStableToken()}
                        on:autoFillClicked={(event) => matchBalance("exchangeField01", event.detail)}
                        on:input={handleExchangeFieldInput}
                    
                        textColor={false}
                        cornerRadius={$roundedCornersSm} 
                        
                        tokenSelection={true}           
                        token={$exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].tokenIcon}
                        textLabel={$exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].vault}
                        dropDownArrow={true}

                        leftFooterText={true}
                        leftFooterTextLabel="Balance {$exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].balance}"

                        inputField={true}
                        inputPlaceholderValue ={0}

                        rightFooterText={true}
                        rightFooterTextLabel="MAX"
                        
                    ></PaymentInputField>
                    {/if}
                    <div class="lowerTitle flex w-full px-3 text-blackPrim-light dark:text-blackPrim-dark justify-between items-center">
                        <div class="leftHandGroup text-sm font-BarlowRegular">
                            You will recieve
        
                        </div>
                        <div class="rightHandGroup w-3">
                            <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('recieveIOU')}>
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
                    </div>
                    {#if $exchangeDepositVaults && $exchangeDepositVaults.length > selectedFAVStable && $exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].tokenIcon}
                    <PaymentInputField on:dropDownClicked={() => selectFAVStableToken()}

                        textColor={false}
                        cornerRadius={$roundedCornersSm}

                        tokenSelection={true}
                        token="/utilityTokens/FAVIOU-{$dropDownSelectionsNames.FAVEarnExchangeStable}.svg"
                        textLabel="{$exchangeDepositVaults[$dropDownSelections.FAVEarnExchangeStable].vault} IOU"
                        dropDownArrow={false}

                        leftFooterText={false}
                        leftFooterTextLabel=""

                        inputField={true}
                        bind:value={exchangeField01}
                        inputDisabled={true}
                        inputPlaceholderValue={0}
                        rightFooterText={false}
                        rightFooterTextLabel=""
                    
                    ></PaymentInputField>
                    {/if}

                <div class="createLoan flex justify-center items-cente p-3">
                        <Button 
                            on:buttonClicked={() => handleExchange()}
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
                        
                            ><span>Exchange</span>
                        </Button>
                    </div>
                </div>
            <!-- </form> -->
    
        </Block>
        <!-- <form id="testForm" action="" on:submit|preventDefault={handleExchange02()}></form> -->
    </div>

    
    <!-- redeem IOUs -->
    <div id="redeemIOUs" class="pageTitleBlock w-full min-w-[200px] max-w-[600px]">

        <div class="sectionSubHeader text-blackPrim-light dark:text-blackPrim-dark flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                <span>Redeem IOUs</span>
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
        <div class="sectionCopy flex px-3 py-2 text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowLight text-xs">
                <span>If the IOU values you hold are smaller than the pool size you will be able to redeem them immediately for the available DeFi stabecoins.
                </span>
            </div>
            <div class="rightHandGroup">
                
            </div>
        </div>

        <Block 
            pagination={false}
            borderColor={false}
            >
            <div class="redeemIOUsContent">
                
                <div class="upperCopyTitle px-3 flex w-full text-blackPrim-light dark:text-blackPrim-dark justify-between items-center">
                    <div class="leftHandGroup text-sm">
                        Select the IOU you would like to redeem
    
                    </div>
                    <div class="rightHandGroup w-3">
                        <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('selectIOU')}>
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
                </div>
                {#if $redeemableIOUBalances && $redeemableIOUBalances.length > selectedIOU && $redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].ticker}
                    <PaymentInputField on:dropDownClicked={() => selectIOU()}
                        
                        textColor={false}
                        cornerRadius={$roundedCornersSm} 
                        
                        tokenSelection={true}
                        token={$redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].tokenIcon}
                        textLabel={$redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].ticker}
                        dropDownArrow={true}

                        leftFooterText={true}
                        leftFooterTextLabel="Balance {_round($redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].available,7)}"

                        inputField={true}
                        bind:value={redeemField01}
                        inputPlaceholderValue = {0}

                        rightFooterText={true}
                        rightFooterTextLabel="MAX"
                        
                    ></PaymentInputField>
                
    
            <div class="upperTitle px-3 flex w-full text-blackPrim-light dark:text-blackPrim-dark justify-between items-center">
                <div class="leftHandGroup text-sm">
                    Available for redemption  <span class="font-BarlowBold">{_round($redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].redeemable,7)} {$redeemableIOUBalances[$dropDownSelections.FAVEarnRedeemIOU].stablecoin}</span>

                </div>
                <div class="rightHandGroup w-3">
                    <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('availableForRedemption')}>
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
            </div>
    
            {/if}
            <div class="createLoan flex justify-center items-cente p-3">
                    <Button 
                        on:buttonClicked={() => handleRedeem()} 
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
                        
                        ><span>Redeem</span>
                    </Button>
                </div>
            </div>
            
    
        </Block>

    </div>
    


</div>


