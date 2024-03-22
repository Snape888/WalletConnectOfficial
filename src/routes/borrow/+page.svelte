<script lang="ts">
    
    // Svelte imports
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { get } from 'svelte/store';
    
    // Project specific imports
    import { pages, currentPage, themeColours, roundedCornersSm, roundedCornersLg, dropShadow } from '$lib/project/js/stores/brandAndTheme.ts';
        
    /// Project Web3 imports
    import {
        updateContractAddresses,
        toWei,
        fromWei,
        executeFunction,
        runViewFunction,
        updateCurrentSelectedDropdowns,
        checkAllowances,
        getWalletBalances
        
    } from "$lib/project/js/helpers" 

    import { createExchangeDepositsVaultsArray, createSystemLoans, createMyLoansArray } from "$lib/project/js/FAVfunctionCalls.ts";

    import { ethers } from 'ethers';

    import {
        user,
        chainId,
        borrowableVaults,
        borrowVaults,
        loanTerms,
        monthlyInstallmentPreview,
        basePricePreview,
        totalRepayablePreview,
        userBalance,
        depositSwapVaults,
        dropDownSelections,
        walletBalances,
        dropDownSelectionsNames,
        contractAddresses,
        FAVLoanDepositAllowance, 
        loanSummary,
        referUser,
        txProcessMessage

    } from '$lib/project/js/stores/projectDynamicValues.ts';
    import mortgagePoolContractAbi from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
    import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
    
    //on-chain data execution
    import {
        createLoan
        
    } from '$lib/project/js/FAVfunctionCalls.ts';
    
    // Boilerplate components
    import Block from '$lib/boilerplate/components/Block.svelte';
    import Button from '$lib/boilerplate/components/Button.svelte';
    import TokenSelection from '$lib/boilerplate/components/TokenSelection.svelte';
    import PaymentInputField from '$lib/boilerplate/components/PaymentInputField.svelte';
    import Radio from '$lib/boilerplate/components/Radio.svelte';
    import HelpMessageModal from '$lib/boilerplate/components/HelpMessageModal.svelte';


    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
    import { _round } from "$lib/boilerplate/js/core";

    /// Web3 functions ---------------------------------------------------------


    //Reactive balances of currently selected vaults
    $: borrowErc20Balance = $walletBalances && $walletBalances[Number($chainId)] && $walletBalances[Number($chainId)].vaults && $walletBalances[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault] && $walletBalances[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens && $walletBalances[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"] && $walletBalances[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].balance !== undefined
    ? "Balance " + $walletBalances[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].balance
    : 'Loading...';

    let monthlyInstallmentsWSlippage =0;
    //$: monthlyInstallments = $loanSummary.monthlyInstallment;
    $: if ($contractAddresses && $contractAddresses.stablecoinDecimals !== "") {
    monthlyInstallmentsWSlippage = Number(slippage) + Number(fromWei($loanSummary.monthlyInstallment, $contractAddresses.stablecoinDecimals));
    } 




  /// End of Web 3 functions ------------------------------------------------

    ////// Loan form -------------------------------------------------------------------------------------

    let amountToBorrow: number | null = null; // Reactive variable to hold the input value
    let slippage: number | null = null;
    let loanTerm = 30;


    ////// End of Loan form --------------------------------------------------------------------------------

    function isValidForm() {
        return amountToBorrow && loanTerm && slippage; // Checks if all fields have values
    }

    // variables for for dropdown selections
    let showTokenSelection = false;
    let showTermSelection = false;

    //setting the dropdown for the borrowable loans
    // let selectedToken = $borrowableVaults.reduce((prev, current) => (prev.available > current.available) ? prev : current);
    let selectedBorrowToken = 0;
    let selectedTerm = 29;
    let selectedLabel = '';
   





    function addSlippage(percent){
        slippage =  Number(fromWei($loanSummary.monthlyInstallment,  $contractAddresses.stablecoinDecimals))*percent;
    }

    function updateSlippage(event) {
        slippage = event.detail;

    }

    function selectToken(){
        showTokenSelection = !showTokenSelection;
    };

   // Function to handle token selection
    function handleTokenSelection() {
        showTokenSelection = false;

    }

    // Function to handle token selection
    function handleTermSelection() {
        showTermSelection = false;

    }

    function findVaultById(event) {
        handleTokenSelection()
        // Convert Svelte store to a regular array
        const selectedVaultId = event.detail;
        console.log("event details: "+selectedVaultId);

        // Find the index of the element with the specified id
        const index = $depositSwapVaults.findIndex(token => token.id === selectedVaultId);

        
        if (index != -1){
            selectedBorrowToken = index;
            $dropDownSelections.FAVLoanBorrowVault = event.detail;
            updateCurrentSelectedDropdowns();
        }
        //reset loan summary
        $loanSummary = ({
            monthlyInstallment: 0,
            poolUtilisation: 0,
            interestRate: 0,
            depositSize:0,
            totalRepayable: 0,
            basePrice: 0,
            tokensAvailable: 0
        });
        amountToBorrow = null;
        checkAllowances();
        // return index; // returns -1 if no element is found
    }

    function findTermById(event) {
        handleTermSelection();
        // Convert Svelte store to a regular array
        const loanTermsArray = $loanTerms;
        const selectedTermId = event.detail;

        // Find the index of the element with the specified id
        const index = loanTermsArray.findIndex(token => token.id === selectedTermId);

        if (index != -1){
            selectedTerm = index;
            loanTerm = selectedTerm + 1;
            updateCurrentSelectedDropdowns();
        }

        handleBorrowFieldInput();
        
        // return index; // returns -1 if no element is found
    }

    function selectTerm(){
        showTermSelection = !showTermSelection;
    };




    ///Help modal -------------------------------------------------------------

    let helpModals = {
        borrowAmountInput: false,
        loanTerm: false,
        slippage: false,
        borrowAmount: false,
        monthlyInstallments:false,
        baseTokenPrice: false,
        totalRepayable: false,
    }

    function toggleHelp(modalName){
        helpModals[modalName] = !helpModals[modalName];
    }

    ///End of Help modal ------------------------------------------------------


    let createLoanButtonLabel = 'Create loan'; // Initialize the button label


    // Reactive statement to update the button label
    $: if ($FAVLoanDepositAllowance !== null && Number(amountToBorrow) > Number($FAVLoanDepositAllowance)) {
        createLoanButtonLabel = 'Approve';
    } else {
        createLoanButtonLabel = 'Create loan';
    }

    async function handleCreateLoan(createLoanButtonLabel) {

        if (isValidForm()) {
            console.log({ amountToBorrow, loanTerm, slippage });
            // createLoan(amountToBorrow, loanTerm, slippage);

        } else {
            console.log("Form is incomplete");
            // Handle the incomplete form case (e.g., show an error message)
        }

        // console.log("mortgagePoolContractAbi = ", mortgagePoolContractAbi);
        console.log("handleCreateLoan mortgageContractsInfo = ", mortgageContractsInfo[Number(chainId)]);

        // get the mortgage and erc20 contract addresses of the currently selected vault/dropdown
        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].coreContracts["Mortgage Pool"].address;
        const erc20Contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].address;
        const erc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].decimals;
        const stablecoinDecimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Stablecoin"].decimals;


        updateContractAddresses();
        if (createLoanButtonLabel== "Approve"){
            // console.log("Run Approve function");
            // console.log("contract addresses = ", $contractAddresses);

            let loanDepositAmount = Number(amountToBorrow);
            let approveAmount = toWei(loanDepositAmount, erc20Decimals);
            
            const args = [contract, approveAmount];

            // console.log("favStableAddress: " +favStableAddress+ " args: " +args)
            // Call executeFunction with the retrieved values
            let result = await executeFunction(erc20Contract, erc20Abi, "approve", args);

            if (result) {
                console.log("Transaction successful");
                await checkAllowances();
                $txProcessMessage = false;

                // Additional logic on success
            } else {
                console.error("Transaction failed");
                // Additional logic on failure
            }

        } else if (createLoanButtonLabel== "Create loan") {
            // console.log("Run Deposit function");
            // console.log("contract addresses = ", $contractAddresses);
            // console.log("token decimals = ", $contractAddresses.stablecoinDecimals);
            let referrer;
            function isValidEthereumAddress(address) {
             return ethers.isAddress(address);
}
            if($referUser && isValidEthereumAddress($referUser)){
                referrer = $referUser;
            } else {
                referrer = $user;
            }
            let amountToBorrowInWei = toWei(amountToBorrow, erc20Decimals);
            let installementsInWei = toWei(monthlyInstallmentsWSlippage, stablecoinDecimals);
            let createLoanArgs = [amountToBorrowInWei,loanTerm, installementsInWei, referrer];

            // console.log("Write contract: mortgagePoolAddress", $contractAddresses.mortgagePoolAddress);
            // Call executeFunction with the retrieved values
            let result = await executeFunction(contract, mortgagePoolContractAbi, "createContract", createLoanArgs);

            if (result) {                
                await getWalletBalances();
                await checkAllowances();
                await createMyLoansArray();
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

    async function handleBorrowFieldInput(){

        // get the mortgage and stablecoin contract addresses of the currently selected vault/dropdown
        const contract = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].coreContracts["Mortgage Pool"].address;
        const erc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].decimals;

        console.log("handleBorrowField contract = ", contract, "erc20Decimals = ", erc20Decimals );

        //checkAllowances();
        // let duration = parseInt(loanTerm[1], 10);
        let duration = loanTerm;
        let args = [toWei(Number(amountToBorrow), erc20Decimals), duration];
        console.log("handleBorrowFieldInput: simulateMonthlyPayments inputs: contract = ", contract, " args = ", args);
        let result = await runViewFunction({
            contractAddress: contract,
            abi: mortgagePoolContractAbi,
            functionName: 'simulateMonthlyPayment',
            args: args,
        });
        console.log("handleBorrowFieldInput: simulateMonthlyPayments output:  = ", result);
        // console.log("simulate payments: ", result);
        let basePriceArgs = [];
        let erc20BasePrice = await runViewFunction({
            contractAddress: contract,
            abi: mortgagePoolContractAbi,
            functionName: 'freeCoins',
            args: basePriceArgs,
        });
        console.log("Base price: ", erc20BasePrice);

        interface SimulationResult {
        monthlyInstallment: bigint;
        poolUtilisation: bigint;
        interestRate: bigint;
        depositSize: bigint;
        totalRepayable: bigint;
        }

        interface BasePriceResult {
        basePrice: bigint;
        tokensAvailable: bigint;
        }

        // Assume result is of type SimulationResult for this operation
        const simulationResult = result as unknown as SimulationResult;
        const basePriceResult = erc20BasePrice as unknown as BasePriceResult;

        loanSummary.set({
        monthlyInstallment: Number(simulationResult[0]),
        poolUtilisation: Number(simulationResult[1]),
        interestRate: Number(simulationResult[2]),
        depositSize: Number(simulationResult[3]),
        totalRepayable: Number(simulationResult[4]),
        basePrice: Number(basePriceResult[1]),
        tokensAvailable: Number(basePriceResult[0]),
        });

        console.log("loan summary info: ", $loanSummary);
    }

    async function populateBorrowAmount(){
        const erc20Decimals = mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].decimals;
        await handleBorrowFieldInput();
        amountToBorrow = Number(fromWei($loanSummary.tokensAvailable, erc20Decimals));
        await handleBorrowFieldInput();
    }


</script>

<HelpMessageModal
    visible={helpModals['borrowAmountInput']} 
    helperName="borrowAmountInput"
    titleCopy="Amount to borrow"
    bodyCopy01="Enter the amount you would like to borrow excluding your deposit."
    on:close={() => toggleHelp('borrowAmountInput')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['loanTerm']} 
    helperName="loanTerm"
    titleCopy="Loan term"
    bodyCopy01="States the total length of the loan. Loan terms range from 1 to 30 years"
    on:close={() => toggleHelp('loanTerm')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['slippage']} 
    helperName="slippage"
    titleCopy="Add slippage"
    bodyCopy01="If two borrowers create loans at the same time then the borrower who adds the highest slippage will be granted the loan."
    on:close={() => toggleHelp('slippage')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['borrowAmount']} 
    helperName="borrowAmount"
    titleCopy="Loan amount"
    bodyCopy01="This is the total amount you will be borrowing, it excludes interest fees, initial deposit and any slippage you've added."
    on:close={() => toggleHelp('borrowAmount')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['monthlyInstallments']} 
    helperName="monthlyInstallments"
    titleCopy="Monthly installments"
    bodyCopy01="The amount you will need to pay thoughout each month including any slippage you've added.<br> Months are strictly 30 days long (as opposed to calender months).<br> Partial payments are accepted."
    on:close={() => toggleHelp('monthlyInstallments')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['baseTokenPrice']} 
    helperName="baseTokenPrice"
    titleCopy="Base token price"
    bodyCopy01="This is the price you are paying per ERC20 token before interest fees or any slippage you've voluntered are added."
    on:close={() => toggleHelp('baseTokenPrice')}     
></HelpMessageModal>

<HelpMessageModal
    visible={helpModals['totalRepayable']} 
    helperName="totalRepayable"
    titleCopy="Total repayable"
    bodyCopy01="This amount reflects the total you will pay over the term of the loan assuming you do not choose to repay the loan early. <br> This inlcudes the token base price, all interest fees and any extra slippage you've added.<br>"
    on:close={() => toggleHelp('totalRepayable')}     
></HelpMessageModal>

<TokenSelection visible={showTokenSelection} 
    tokenList={$borrowVaults}
    title="Select vault"
    on:tokenSelected={findVaultById}  
></TokenSelection>

<TokenSelection visible={showTermSelection} 
    tokenList={$loanTerms}
    title="Select loan term"
    on:tokenSelected={findTermById}  
></TokenSelection>

<div transition:slide class="flex flex-col justify-center items-center space-y-5 w-full">
    <div class="pageTitleBlock text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px]">
        <div class="sectionHeader flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup w-20 py-5">
                    <!-- Light Mode Image -->
                    <img src="/FAVLogos/FAV LOANS.svg" 
                    alt="FAV Loans logo" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/FAVLogos/FAV LOANS rev.svg" 
                    alt="FAV Loans logo" 
                    class="hidden dark:block" />
            </div>
            <div class="rightHandGroup w-12">            
            </div>
        </div>
        <div class="sectionSubHeader flex px-3 w-full min-w-[200px] max-w-[600px] justify-between items-center">
            <div class="leftHandGroup font-BarlowBold leading-none text-lg">
                <span>Borrow up to 50 times your deposit</span>
            </div>
            <div class="rightHandGroup">
                <Button 
                cornerRadius={$roundedCornersSm}
                textColor="text-bluePrim-light"
                font={false}
                textSize="text-xs"
                border="border"
                paddingX={false}
                paddingY="py-1.5"
                backgroundColor="bg-whitePrim-light dark:bg-whitePrim-dark"
                borderColor="border-bluePrim-light"
                type="button"
                >
            <span>Learn more</span>
                </Button>  
            </div>
        </div>
        <div class="sectionCopy flex px-3 py-2 w-full min-w-[200px] max-w-[600px] justify-between items-center ">
            <div class="leftHandGroup font-BarlowLight text-xs ">
                <span>Complete the application fields below to see an illustration of your potential loan.</span>
            </div>
            <div class="rightHandGroup">
                
            </div>
        </div>
        

        <form on:submit|preventDefault={async (event) => {
            // Prevent the form from submitting traditionally
            event.preventDefault();
            // Call your async function here
            await handleCreateLoan(createLoanButtonLabel);
            }}>
            <Block 
                borderColor={$themeColours['borrow'].light}
                pagination={false}>
                {#if $depositSwapVaults && $depositSwapVaults.length > selectedBorrowToken && $depositSwapVaults[$dropDownSelections.FAVLoanBorrowVault].tokenIcon}
                    <div class="borrowContent p-3">
                        <div class="upperTitle flex w-full px-3 justify-between items-center">
                            <div class="leftHandGroup text-sm">
                                How much would you like to borrow?
            
                            </div>
                            <div class="rightHandGroup w-3">
                                <button type="button" class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('borrowAmountInput')}>
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
                        <PaymentInputField 
                            on:dropDownClicked={() => selectToken()} bind:value={amountToBorrow}
                            on:input={handleBorrowFieldInput}
                            on:autoFillClicked={populateBorrowAmount}

                            textColor={false}
                            cornerRadius={$roundedCornersSm}

                            tokenSelection={true}
                            
                            token={$depositSwapVaults[$dropDownSelections.FAVLoanBorrowVault].tokenIcon}
                            textLabel={$depositSwapVaults[$dropDownSelections.FAVLoanBorrowVault].ticker}
                            dropDownArrow={true}
                        
                            leftFooterText={true}
                            leftFooterTextLabel={borrowErc20Balance}
                            
                            inputField={true}
                            inputPlaceholderValue = {0}
                            
                            rightFooterText={true}
                            rightFooterTextLabel="ENTIRE POOL"  
                            autoFillFigure={Number(amountToBorrow)}                  
                            
                            ></PaymentInputField>
                        <div class="middleTitle flex w-full px-3 justify-between items-center">
                            <div class="leftHandGroup text-sm">
                                How long should the loan last?
            
                            </div>
                            <div class="rightHandGroup w-3">
                                <button type="button" class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('loanTerm')}>
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
                        <PaymentInputField
                            on:dropDownClicked={() => selectTerm()} 
                            
                            bind:value={loanTerm}

                            textColor={false}
                            cornerRadius={$roundedCornersSm}

                            tokenSelection={true}
                            token={""}
                            textLabel={$loanTerms[selectedTerm].ticker}
                            textLabelGreyed={$loanTerms[selectedTerm].available}
                            dropDownArrow={true}

                            leftFooterText={false}
                            leftFooterTextLabel=""
                            
                            inputField={false}
                            
                            rightFooterText={false}
                            rightFooterTextLabel="ENTIRE POOL"  


                        ></PaymentInputField>
                        <div class="lowerTitle flex w-full px-3 justify-between items-center">
                            <div class="leftHandGroup text-sm">
                                Add slippage
            
                            </div>
                            <div class="rightHandGroup w-3">
                                <button type="button" class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('slippage')}>
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
                        <PaymentInputField 
                            on:input={updateSlippage}
                            bind:value={slippage}

                            textColor={false}
                            cornerRadius={$roundedCornersSm}

                            tokenSelection={false}
                            token={""}
                            textLabel=""
                            dropDownArrow={false}

                            leftFooterText={false}
                            leftFooterTextLabel="Balance"

                            inputField={true}
                            inputPlaceholderValue = {0}
                            
                            rightFooterText={false}
                            rightFooterTextLabel=""
                            
                            
                        ></PaymentInputField>
            
                        <div class="loanTechDetails px-3 font-BarlowRegular text-xs">
                            {#if Number(amountToBorrow) > 0}
                            <div class="slippageSelector flex gap-x-1 justify-left items-center">
                                <span class="flex gap-2">
                                    Slippage
                                </span>
                                <button type="button" on:click={() => addSlippage(0.01)} class="border rounded-md px-1.5 border-blackPrim">
                                    1%
                                </button>
                                <button type="button" on:click={() => addSlippage(0.02)} class="border rounded-md px-1.5 border-blackPrim">
                                    2%
                                </button>
                                <button type="button" on:click={() => addSlippage(0.05)} class="border rounded-md px-1.5 border-blackPrim">
                                    5%
                                </button>
                            </div>
                            
                            <div class="tokensAvailable">Max tokens available: {_round(fromWei($loanSummary.tokensAvailable, $contractAddresses.depositErc20Decimals), 6)} {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].ticker}</div>
                            <div class="poolUtilisation">Projected pool utilisation: { _round(Number($loanSummary.poolUtilisation)*0.01, 4)} %
                                {#if Number($loanSummary.poolUtilisation)*0.01>100}
                                <span class="text-orangePrim-light font-BarlowSemibold">NOT ENOUGH AVAILABLE - PLEASE BORROW LESS</span>
                                {/if}
                            </div>
                            <div class="disclaimer">Note about early repayment charge for this</div>
                   

                            {/if}
                        </div>
                        <div class="loanSummary text-sm text-center py-2">
                            <div class="title">
                                <span class="font-BarlowSemiBold text-navyPrim">Your loan summary</span>
                                
                            </div>
                            {#if Number(amountToBorrow) > 0}
                            <div class="loanAmount flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Loan amount: </span><span class="font-BarlowSemiBold">{#if amountToBorrow}{_round(amountToBorrow,8)}  {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].ticker}{/if}</span>
                                <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('borrowAmount')}>
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
                            <div class="monthlyInstallments flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Monthly installments: </span><span class="font-BarlowSemiBold">
                                    {_round(monthlyInstallmentsWSlippage,8)} {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Stablecoin"].ticker} (inc. slippage)</span>
                                <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('monthlyInstallments')}>
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
                            <div class="baseTokenPrice flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Base token price: </span><span class="font-BarlowSemiBold">{_round(fromWei($loanSummary.basePrice, $contractAddresses.stablecoinDecimals),8)} {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Stablecoin"].ticker}</span>
                                <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('baseTokenPrice')}>
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
                            <div class="totalRepayable flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Total repayable: </span><span class="font-BarlowSemiBold">{_round(fromWei($loanSummary.totalRepayable, $contractAddresses.stablecoinDecimals),8)} {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Stablecoin"].ticker}</span>
                                <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('totalRepayable')}>
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
                            <div class="requiredDeposit flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Required deposit: </span><span class="font-BarlowSemiBold">{fromWei($loanSummary.depositSize, $contractAddresses.depositErc20Decimals)} {mortgageContractsInfo[Number($chainId)].vaults[$dropDownSelectionsNames.FAVLoanBorrowVault].tokens["Deposit erc20"].ticker}</span>
                            </div>
                            <div class="loanTerm flex gap-1 justify-center items-center">
                                <span class="font-BarlowRegular">Loan term: </span><span class="font-BarlowSemiBold">{$loanTerms[selectedTerm].available}</span>
                            </div>
                            {:else}
                            <span class="font-BarlowRegular text-navyPrim">Input a loan amount to view the loan breakdown</span>
                            {/if}
                            
                        </div>
                        <div class="createLoan flex justify-center items-cente p-3">
                            <Button 
                                type="submit"
                                cornerRadius={$roundedCornersSm} 
                                textColor="text-whitePrim-light"

                                font={false}
                                textSize="text-sm"
                                border={false}
                                paddingX="px-4"
                                paddingY="py-1.5"
                                backgroundColor={false}
                                borderColor={false} 
                                >
                                <span>{createLoanButtonLabel}</span>
                            </Button>
                        </div>
                    </div>
                {:else}

                    Loading ...
               {/if} 

            </Block>
        </form>
        <!-- <form id="testForm" action="" on:submit|preventDefault={handleExchange02()}></form> -->
    </div>

    

</div>

