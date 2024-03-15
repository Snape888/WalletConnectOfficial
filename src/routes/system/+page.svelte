<script>
    
    // Svelte imports
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    // Project specific imports
    import { currentPage,themeColours, roundedCornersSm} from '$lib/project/js/stores/brandAndTheme.ts';
    import { 
        formatDuration
    } from '$lib/project/js/helpers';
    //on chain-data reads
    import {
        protocolLoans,
        protocolInfo,
        vaultFilter,
        dropDownSelections,
        vaultLoans,
        systemVaults,
        txProcessMessage
    } from '$lib/project/js/stores/projectDynamicValues.ts';

    //on chain-data execution
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
        abbreviate,
        getWalletBalances,
        toTitleCase
        } from "$lib/project/js/helpers.ts";
    import {
        defaultLoan,
        getTVL,
        createSystemLoans
    } from '$lib/project/js/FAVfunctionCalls.ts';

    import Countup from "svelte-countup";
    import { _round } from "$lib/boilerplate/js/core";        
    // Boilerplate Components
    import Block from '$lib/boilerplate/components/Block.svelte';
    import Button from '$lib/boilerplate/components/Button.svelte';
    import TokenSelection from '$lib/boilerplate/components/TokenSelection.svelte';
    import PaymentInputField from '$lib/boilerplate/components/PaymentInputField.svelte';
    import Radio from '$lib/boilerplate/components/Radio.svelte';
    import HelpMessageModal from '$lib/boilerplate/components/HelpMessageModal.svelte';
    

    import { triggerCdpsAppContractCalls, user, chainId } from "$lib/boilerplate/js/stores/wallet";
    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
    import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
  import { getEventListeners } from 'events';
    
    let selectedVaultId = null; // This stores the selected vault's ID

    let selectedVault = 0;

    let showVaultSelection = false;

    // Function to handle token selection
    function handleVaultSelection() {
        showVaultSelection = false;
    }

    function findVaultById(event) {
        handleVaultSelection();
        // Convert Svelte store to a regular array
        const vaultArray = $systemVaults;
        const selectedVaultId = event.detail;

        // Find the index of the element with the specified id
        const index = vaultArray.findIndex(vault => vault.id === selectedVaultId);

        if (index != -1){
            selectedVault = index;
            $dropDownSelections.FAVSystemLoanVault = selectedVault;
        }
        console.log("$systemVaults[selectedVault] = ", $systemVaults[selectedVault].ticker);


    }

    function selectVault(){
        showVaultSelection = !showVaultSelection;
    };

    ////

    let currentList = 1;
    let itemsPerList = 10;
    let paginatedLoans = [];

    $: {
    if ($vaultLoans && $vaultLoans.length) {
        const startIndex = (currentList - 1) * itemsPerList;
        const endIndex = startIndex + itemsPerList;
        paginatedLoans = $vaultLoans.slice(startIndex, endIndex); // This line uses $protocolLoans directly
    }
}

    // Handle page change from Block component
    function onPageChange(event) {
        console.log(event);
        currentList = event.detail.currentPage; // Update to use currentPage
        itemsPerList = event.detail.itemsPerPage; // Update to use itemsPerPage
    }

    let filteredLoans = [];

    $: {
        if ($vaultLoans && $vaultLoans.length) {
            filteredLoans = $vaultLoans.filter(loan => loan.vault === $systemVaults[selectedVault].ticker);
        }
    }

    $: {
    if (filteredLoans && filteredLoans.length) {
        const startIndex = (currentList - 1) * itemsPerList;
        const endIndex = startIndex + itemsPerList;
        paginatedLoans = filteredLoans.slice(startIndex, endIndex);
    }
}
    ///Help modal -------------------------------------------------------------

    let helpModals = {
        systemPage: false,
    }

    function toggleHelp(modalName){
        helpModals[modalName] = !helpModals[modalName];
    }

    ///End of Help modal ------------------------------------------------------


    async function handleDefault(vault, loanId){
         // console.log("mortgagePoolContractAbi = ", mortgagePoolContractAbi);

        // get the mortgage and stablecoin contract addresses of the currently selected vault/dropdown
        const contract = mortgageContractsInfo[$chainId].vaults[vault].coreContracts["Mortgage Pool"].address;
        
        console.log("handleDefault: mortgagePoolContract", contract);       
        const args = [loanId];

        // Call executeFunction with the retrieved values
        let result = await executeFunction(contract, mortgagePoolContractAbi, "defaultContract", args);

        if (result) {
            console.log("Transaction successful");
            createSystemLoans();
            $txProcessMessage = false;
            // Additional logic on success
        } else {
            console.error("Transaction failed");
            $txProcessMessage = false;
            // Additional logic on failure
        }      
    }

</script>

<TokenSelection visible={showVaultSelection} 
    tokenList={$systemVaults}
    title="Filter vault"
    on:tokenSelected={findVaultById}  
></TokenSelection>

<HelpMessageModal
    visible={helpModals['systemPage']} 
    helperName="SystemLoansList"
    titleCopy="Systems loans"
    bodyCopy01="The list on this page allows you to force borrowers who are not keeping up with their payments to default. <br>This helps keep the FAV ecosystem in balance and rewards FAV Earn depositors with increased yield, leading to increased incentives to add more liquidity for potential borrowers."
    on:close={() => toggleHelp('systemPage')} 
></HelpMessageModal>


<!-- Global system stats -->
<div transition:slide class="networkStats w-full mb-5 min-w-[200px] max-w-[600px] pt-5 flex px-3 gap-x-8 items-center justify-center font-BarlowRegular  xs:text-base text-xs">
    <div class="network font-BarlowBold text-bluePrim-light">
        {#if mortgageContractsInfo}
        {toTitleCase(mortgageContractsInfo[$chainId].networkName)}
        {/if}
        
    </div>

                {#each $protocolInfo as item}
                    {#if item.name === 'noEthContracts'}
                        <div class="text-blackPrim-light dark:text-blackPrim-dark">Live contracts <span class="text-blackPrim-light dark:text-blackPrim-dark font-BarlowBold">
                            {#if $vaultLoans.length > 0}
                                <Countup value={$vaultLoans.length}/>                                
                            {/if}                            
                        </span></div>
                    {:else if item.name === 'ethTVL'}
                        <div class="text-blackPrim-light dark:text-blackPrim-dark">TVL <span class="text-blackPrim-light dark:text-blackPrim-dark font-BarlowBold">
                            {#if $systemVaults.length > 0}
                                ~${_round(getTVL(), 7)}
                            {/if}
                        </span></div>
            {/if}
                {/each}



</div>

<div transition:slide class="flex flex-col justify-center items-center space-y-10 w-full">

    <div class="pageTitleBlock w-full min-w-[200px] max-w-[600px]">
        <div class="sectionMain w-full min-w-[200px] max-w-[600px] px-3 h-auto">
            <div class="sectionHeader xs:py-1 flex justify-between items-center">
                <div class="leftHandGroup flex gap-x-1 items-center">
                    <div class="text-blackPrim-light dark:text-blackPrim-dark font-BarlowSemiBold">
                        System loans
                    </div>
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
                    backgroundColor="bg-whitePrim-light dark:whitePrim-dark"
                    borderColor={false}
                    >
                    <span>Learn more</span>
                </Button>
                </div>
            </div>
            <!-- Grid Container -->
            <div class="sectionColumns text-blackPrim-light dark:text-blackPrim-dark px-3 grid xs:grid-cols-[0.3fr_1fr_1fr_1fr_1fr_60px] grid-cols-[50px_1fr_1fr_60px] font-BarlowRegular text-center text-xs gap-4">
                <!-- Grid Items -->
                <div class="column1">Contract</div>
                <div class="column2">Size</div>
                <div class="column3">Owner</div>
                <div class="column4 hidden xs:block">Vault</div>
                <div class="column5 hidden xs:block">Arrears (days)</div>
            </div>
        </div>
        <Block
        borderColor={$themeColours["borrow"].light} 
        pagination={true} 
        totalItems={filteredLoans.length} 
        itemsPerPageOptions={[5, 10, 25, 'all']} 
        initialItemsPerPage={1} 
        on:pageChange={onPageChange}
    >
    {#if systemVaults && $systemVaults.length > selectedVault && $systemVaults[$dropDownSelections.FAVSwapDepositVault].tokenIcon}
        <div class="px-3">
            <div class="upperTitle px-3 flex w-full justify-between items-center">
                <div class="leftHandGroup text-blackPrim-light dark:text-blackPrim-dark text-sm">
                    Select which system loans you would like to view below
                </div>
                <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('systemPage')}>
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
            
            <PaymentInputField on:dropDownClicked={() => selectVault()}
                
            
            textColor={false}
            cornerRadius={$roundedCornersSm}

            tokenSelection={true}
            token={$systemVaults[$dropDownSelections.FAVSystemLoanVault].tokenIcon}
            textLabel={$systemVaults[$dropDownSelections.FAVSystemLoanVault].ticker}
            dropDownArrow={true}

            leftFooterText={false} 
            leftFooterTextLabel="" 

            inputField={false} 
            

            rightFooterText={false} 
            rightFooterTextLabel=""

        ></PaymentInputField>
        <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content space-y-4"> 
            {#each $vaultLoans as loan}
                {#if loan.vault === $systemVaults[selectedVault].vault && loan.ownerAddress != mortgageContractsInfo[$chainId].vaults[loan.vault].coreContracts["Mortgage Pool"].address}
                    <li class="text-blackPrim-light dark:text-blackPrim-dark list-none">
                        <div class="loansMain">
                            <div  class="loanDetails max-w-[600px] grid xs:grid-cols-[0.3fr_1fr_1fr_1fr_1fr_60px] grid-cols-[50px_1fr_1fr_60px] gap-x-4 items-center text-center font-BarlowLight text-xs"> 
                                <div class="column1 overflow-hidden font-BarlowSemiBold text-base">{loan.id}</div>
                                <div class="column2 overflow-hidden font-BarlowRegular text-sm ">{loan.baseSize}</div>
                                <div class="column3 overflow-hidden font-BarlowRegular text-sm">{abbreviate(loan.ownerAddress, 5, 3)}</div>
                                <div class="column4 overflow-hidden font-BarlowRegular text-sm hidden xs:block">{loan.vault}</div>
                                <div class="column5 overflow-hidden font-BarlowRegular text-sm hidden xs:block">{(loan.secondsTillLiquidation)}</div>
                                <div class="column6 overflow-hidden font-BarlowRegular text-sm">

                                    <Button 

                                        on:buttonClicked={() => handleDefault(loan.vault, loan.id)}

                                        cornerRadius={$roundedCornersSm} 
                                        textColor={"text-blackPrim-light dark:text-blackPrim-dark"}

                                        font={false}
                                        textSize={false}
                                        border={"border"}
                                        paddingX={false}
                                        paddingY={false}
                                        backgroundColor="bluePrim-light"
                                        borderColor="bluePrim-light"
                                        >
                                        <span>Default</span>
                                    </Button>

                                </div>
                                

                                
                            </div>

                        </div>
                    </li>
                {/if}

            {/each}
        </div>
        </div>
    {:else}
    Nothing to show here yet...

    {/if}

        </Block>

    </div>
</div>



