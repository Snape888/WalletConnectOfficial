<script>
    // Svelte imports
    import { tweened } from 'svelte/motion';
    import { slide } from 'svelte/transition';
    import { fade } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing'
    import { quintOut } from 'svelte/easing';
    import { get } from 'svelte/store';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { BigNumber } from "bignumber.js";

    // Project specific imports
    import { currentPage, themeColours, roundedCornersSm } from '$lib/project/js/stores/brandAndTheme.ts';
    import {
        fromWei,
        toWei,
        formatDuration,
        executeFunction,
        runViewFunction,
        checkNFTAllowance,
        checkAllowances,
        updateManagementButtons,
        updatePricePerCoin,
        getWalletBalances
    } from '$lib/project/js/helpers';

    import  mortgagePoolContractAbi  from "$lib/project/abi/mortgagepool.sol/mortgagepool.json";
    import mortgageTicketsAbi from "$lib/project/abi/mortgagetickets.sol/mortgagetickets.json";
    
    //on-chain data reads
    import { 
        user,
        chainId,
        referralLink,
        myLoans,
        myVaults,
        myIOUs,
        pendingConversions,
        walletBalances,
        loanNFTs,
        contractAddresses,
        redeemableIOUBalances,
        redeemableNFTs,
        FAVLoanRepaymentsAllowance,
        copied,
        loanManagementButtonLabels,
        payOutstandingAmount,
        finaliseLoanButtonLabel,
        exchangeRates,
        txProcessMessage
               
    } from '$lib/project/js/stores/projectDynamicValues.ts';

    import { mortgageContractsInfo } from "$lib/project/js/contractAddresses";
    //on-chain data execution
    import {
        payOutstanding,
        fullyRepay,
        finishLoan,
        getShortestRemainingTime,
        createMyLoansArray
    } from '$lib/project/js/FAVfunctionCalls.ts';

    import { _round } from "$lib/boilerplate/js/core";
  

    // Boilerplate Components
    import Block from '$lib/boilerplate/components/Block.svelte';
    import Button from '$lib/boilerplate/components/Button.svelte';
    import TokenSelection from '$lib/boilerplate/components/TokenSelection.svelte';
    import PaymentInputField from '$lib/boilerplate/components/PaymentInputField.svelte';
    import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
  
    import Radio from '$lib/boilerplate/components/Radio.svelte';




    let showContent = true;




    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText($referralLink + $user);
            $copied=true;
            console.log($referralLink + $user);
            setTimeout(() => $copied=false, 2000); // Message disappears after 2 seconds

        } catch (err) {
            console.error('Failed to copy: ', err);
            // Handle the error case here, maybe set an error message if needed
        }
    }


    // Function to toggle individual button state
    function goToUrl(url, pageAnchor){
        $currentPage = url
        goto("/"+url+"#"+pageAnchor);
    };

    // export let _currentPage;
    // export let _themeColours;
    
    let collapsedStates = {
        myLoans: true,
        myVaults: true,
        myIOUs: true,
        pendingConversions: true,
    };

    // loans expanded states
    let loanExpandStates = {};

    // Function to toggle individual button state
    async function toggleButton(loanId, vaultName){
        // await checkAllowances();
        // await checkNFTAllowance(vaultName, loanId);
        updateManagementButtons(0, vaultName, loanId);
        let combinedKey = loanId + "-" + vaultName; // Combine loanId and vaultName
        loanExpandStates[combinedKey] = !loanExpandStates[combinedKey];
        // Reassign loanExpandStates to trigger reactivity
        loanExpandStates = { ...loanExpandStates };
    }

// Modify the toggleLoanManageTabs function similarly if needed




    // Function to toggle individual button state
    async function toggleLoanManageTabs(loanId, loanVault, tab) { // (loan.id, "outstanding")
        checkNFTAllowance(loanVault, loanId);
        
        console.log("toggleLoanManageTabs = loanId:", loanId, "loanVault = ", loanVault, "tab = ", tab );
        // Get current value of the store
        let loans = $loanNFTs[loanVault];
        let loanIndex = $loanNFTs[loanVault].findIndex(loan => loan.id === loanId);
        console.log("Loan ID = ", loanIndex );

        if (loanIndex !== -1) {
            loans[loanIndex].tabState = tab;
            $loanNFTs[loanVault] = [...loans];
            // console.log(loans[loanIndex].tabState);
            // console.log($loanNFTs);
            // console.log("Loan tabState = ", $loanNFTs[loanVault][loanIndex].tabState);
        }
    }


  


    
    const handleClick = (contentKey) => {
        collapsedStates[contentKey] = !collapsedStates[contentKey];
    };

    // Individual content

    let showReferralLink = false; // Initialize as boolean

// Reactive statement to update showReferralLink based on the user's wallet address
$: showReferralLink = 
  $user && $user !== "0x0000000000000000000000000000000000000000" ? true : false;


    const myLoansSummary =
        {
            numberOfContracts: 4,
            totalBorrowed: "4,337",
            token: "ETH",
            totalPaymentsDue: "67,654",
            totalDebts: "2,543,453"
        };

    const content1Simple = "Simple sentence 1.";
    const content1Collapsed = ["Point 1.1", "Point 1.2", "Point 1.3"];

    const content2Simple = "Simple sentence 2.";
    const content2Collapsed = ["Point 2.1", "Point 2.2", "Point 2.3"];

    const content3Simple = "Simple sentence 3.";
    const content3Collapsed = ["Point 3.1", "Point 3.2", "Point 3.3"];


    // Dashboard summaries info - Vaults
    function getTotalFAVStables() {
        let total = 0;
        if ($walletBalances && $walletBalances[$chainId] && $walletBalances[$chainId].vaults) {
            for (const [vaultName, vault] of Object.entries($walletBalances[$chainId].vaults)) {
                if (vault.tokens && vault.tokens["Mortgage Pool"]) {
                    total += parseFloat(vault.tokens["Mortgage Pool"].balance) || 0;
                }
            }
        }
        return total;
    }
    function getNumberOfFAVStables() {
        let count = 0;
        if ($walletBalances.length > 0) {
            for (const [vaultName, vault] of Object.entries($walletBalances[$chainId].vaults)) {
                if (vault.tokens && vault.tokens["Mortgage Pool"].balance > 0) {
                    count += 1; // Increment count for each valid entry
                }
            }
        }
        return count;
    }

    function getTotalIOUs() {
        let total = 0;
        if ($redeemableIOUBalances && $redeemableIOUBalances.length > 0){
            for (const IOU of $redeemableIOUBalances){
                total += parseFloat(IOU.available);
            }
        }
        return total;
    }

    

    function getRedeemablePercentage() {
        let redeemableTotal = 0;
        let iouTotal =0;
        const seenTickers = new Set();

        if($redeemableIOUBalances.length > 0){
            // Iterate over each IOU object
            for (const IOU of $redeemableIOUBalances) {
                // If the ticker hasn't been processed yet, add its redeemable value to the total
                if (!seenTickers.has(IOU.ticker)) {
                    redeemableTotal += parseFloat(IOU.redeemable) || 0; // Ensure parsing the number, default to 0 if NaN
                    iouTotal += parseFloat(IOU.available) || 0;
                    seenTickers.add(IOU.ticker); // Mark this ticker as seen
                }
            }
            //console.log("getRedeemablePercentage $redeemableIOUBalances.length must be > 0"); 
            let percentageAvailable = _round((redeemableTotal/iouTotal)*100,3);
            if (percentageAvailable>100){
                return "100%";
            }else{
                return percentageAvailable+"%";
            }
        

        }else{
            //console.log("getRedeemablePercentage $redeemableIOUBalances.length must be 0"); 
            return 0;
        }      
    }






    // Dashboard summaries info - Loans
    function getNumberOfLoans() {
        return Object.values($loanNFTs).reduce((total, vaultLoans) => total + vaultLoans.length, 0);
    }

    function getTotalLoansDebt() {
        let totalDebt = 0;
        Object.values($loanNFTs).forEach(vaultLoans => {
            vaultLoans.forEach(loan => {
                // Ensure that totalDebt is a number before adding it
                totalDebt += Number(loan.remainingDebt) || 0;
            });
        });
        return totalDebt;
    }

    
    function getTotalPaymentsPending() {
        let totalPending = 0;
        Object.values($loanNFTs).forEach(vaultLoans => {
            vaultLoans.forEach(loan => {
                // Ensure that totalDebt is a number before adding it
                totalPending += Number(loan.currentPaymentPending) || 0;
            });
        });
        return totalPending;
    }

    function getTotalExpectedConversions() {
        let totalPending = 0;
        // Assuming $redeemableNFTs is an array of loan objects directly
        $redeemableNFTs.forEach(loan => {
            // Add the amountExpected from each loan to totalPending
            totalPending += Number(loan.amountExpected) || 0;
        });
        return totalPending;
    }

    
    
    async function handleLoanManageAction(loanVault, loanId, loanTabState){
        console.log("handleLoanManageAction = loanVault ", loanVault," loanId = ", loanId," loanTabState = ", loanTabState)
        if (loanTabState === "outstanding"){
            handlePayOutstanding(loanVault, loanId)
        } else if (loanTabState === "fullyRepay"){
            // await checkAllowances();
            console.log("handleLoanManageAction, ckeckAllowancesComplete");
            handleFullyRepay(loanVault, loanId)
        } else if (loanTabState === "finish"){
            handleFinishLoan(loanVault, loanId)
        }
    }




    let payOutStandingButtonLabel = {}; // Initialize the button label
    







    async function handlePayOutstanding(vault, loanId) {
        const mortgagePoolContract = mortgageContractsInfo[$chainId].vaults[vault].coreContracts["Mortgage Pool"].address;
        const stablecoinDecimals = mortgageContractsInfo[$chainId].vaults[vault].tokens["Stablecoin"].decimals;
        const stablecoinContract = mortgageContractsInfo[$chainId].vaults[vault].tokens["Stablecoin"].address;

        // Assuming payOutstandingAmount is keyed similarly to loanNFTs and contains the loan amounts
        const loanAmountDetails = $payOutstandingAmount[vault]?.[loanId];
        if (!loanAmountDetails) {
            console.error("Loan details not found for ID:", loanId);
            return;
        }
        console.log("handlePayOutstanding, vault = ", vault," loanId = ", loanId);
        // console.log("mortgagePoolContract = ", mortgagePoolContract);
        // console.log("Loan amount details = ", loanAmountDetails);

        // Determine action based on the button label or another condition
        if ($loanManagementButtonLabels[vault][loanId].payOutstanding === "Approve") {
            const amount = toWei(loanAmountDetails, stablecoinDecimals);
            console.log("Amount toWei = ", amount);
            const args = [mortgagePoolContract, Number(amount)*0.1];
            let result = await executeFunction(stablecoinContract, erc20Abi, "approve", args);

            if (result) {
                console.log("Approval successful");
                $txProcessMessage = false;
                // Additional logic on success
                await checkAllowances();
                updateManagementButtons(0,vault,loanId)
            } else {
                console.error("Approval failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        } else if ($loanManagementButtonLabels[vault][loanId].payOutstanding === "Pay") {
            const amount = toWei(loanAmountDetails, stablecoinDecimals);
            const args = [loanId, amount];
            let result = await executeFunction(mortgagePoolContract, mortgagePoolContractAbi, "payDownContract", args);

            if (result) {
                await createMyLoansArray();
                console.log("Payment successful");
                $txProcessMessage = false;
                // Additional logic on success
            } else {
                console.error("Payment failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        }
    }



    async function handleFullyRepay(vault, loanId) {
        console.log("Enter handleFullyRepay: vault = ", vault, "loanId = ", loanId);
        const mortgagePoolContract = mortgageContractsInfo[$chainId].vaults[vault].coreContracts["Mortgage Pool"].address;
        const stablecoinDecimals = mortgageContractsInfo[$chainId].vaults[vault].tokens["Stablecoin"].decimals;
        const stablecoinContract = mortgageContractsInfo[$chainId].vaults[vault].tokens["Stablecoin"].address;

        // Find the loan object by loanId
        const loan = $loanNFTs[vault].find(loan => loan.id === loanId);
        if (!loan) {
            console.error("Loan not found for ID:", loanId);
            return; // Exit if loan is not found
        }
        console.log("$FAVLoanRepaymentsAllowance[vault] = ", $FAVLoanRepaymentsAllowance[vault]);
        console.log("loan.earlySettlementFigure = ", loan.earlySettlementFigure);
        //console.log("loan = ", loan);
        //console.log("$loanNFTs[vault][loan].tabState = ", $loanNFTs[vault].loan);
        if ($FAVLoanRepaymentsAllowance[vault]<loan.earlySettlementFigure) {
            console.log("handleFullyRepay Enter Approve logic");
            const amount = toWei(loan.earlySettlementFigure, stablecoinDecimals);
            console.log("Amount to approve:", amount);
            const args = [mortgagePoolContract, Number(amount)*0.1];
            let result = await executeFunction(stablecoinContract, erc20Abi, "approve", args);

            if (result) {
                console.log("Approval Transaction successful");
                $txProcessMessage = false;
                // Additional logic on success

                await checkAllowances();
                updateManagementButtons(0,vault,loanId);
                
            } else {
                console.error("Approval Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        } else {
            console.log("handleFullyRepay Enter Fully repay logic");
            const args = [loanId];
            let result = await executeFunction(mortgagePoolContract, mortgagePoolContractAbi, "earlyRepayContractInFull", args);

            if (result) {
                console.log("Payment Transaction successful");
                await createMyLoansArray();
                loan.tabState = "fullyRepay";
                $txProcessMessage = false;
                // Additional logic on success
            } else {
                console.error("Payment Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        }
    }


    async function handleFinishLoan(vault, loanID){
        console.log("enter handleFinishLoan function");
        const mortgageTicketsContract = mortgageContractsInfo[$chainId].vaults[vault].nfts["Mortgage contracts"].address;
        const mortgagePoolContract = mortgageContractsInfo[$chainId].vaults[vault].coreContracts["Mortgage Pool"].address;

        const isNFTAllowed = await checkNFTAllowance(vault, loanID);

        if (isNFTAllowed) { // then contract can be finalized because approval is in place
            console.log("FinishLoan checkNFTAllowance = ", isNFTAllowed, ", executing finishContract");
            let args = [loanID];
            let result = await executeFunction(mortgagePoolContract, mortgagePoolContractAbi, "finishContract", args);

            if (result) {
                console.log("Transaction successful");
                await getWalletBalances();
                await createMyLoansArray();
                $txProcessMessage = false;
                // Additional logic on success
                
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }

        } else { // need to approve movement of the mortgage NFT from the user's wallet to the mortgageContract
            console.log("FinishLoan checkNFTAllowance = ", isNFTAllowed, ", executing approve");
            let args = [mortgagePoolContract, loanID];
            let result = await executeFunction(mortgageTicketsContract, mortgageTicketsAbi, "approve", args);

            if (result) {
                console.log("Approve transaction successful");
                $txProcessMessage = false;
                await checkNFTAllowance(vault, loanID);
                updateManagementButtons(0,vault,loanID);
                // Additional logic on success
            } else {
                console.error("Transaction failed");
                $txProcessMessage = false;
                // Additional logic on failure
            }
        }
    }

    function formatRemainingTime(remainingTime, section){
        if (section === "pendingConversions" && remainingTime.includes("-")) {
            return "Redeem now"; // Past time, treat as 0 minutes
        }
        else if(section === "loans" && remainingTime.includes("-")) {
            return "Term complete"; // Past time, treat as 0 minutes
        }else{
            return remainingTime
        }
    }


</script>


<!-- main page -->
<div transition:slide class="flex flex-col justify-center items-center space-y-10 w-full">
    <!-- My loans -------------------------------------------------------------------->
    <div class="sectionMain w-full text-blackPrim-light dark:text-blackPrim-dark min-w-[200px] max-w-[600px] h-auto">
        <div class="sectionHeader xs:py-1 flex px-3 justify-between pb-2 items-center">
            <div class="leftHandGroup flex gap-x-1 items-center">
                <div class="font-BarlowSemiBold">
                    My Loans
                </div>
                <button class="eyeOpenShut w-5" on:click={() => handleClick('myLoans')}>
                    {#if collapsedStates.myLoans}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeOpen.svg" 
                             alt="Eye Open Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeOpen-D.svg" 
                             alt="Eye Open Icon" 
                             class="hidden dark:block" />
                    {:else}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeShut.svg" 
                             alt="Eye Closed Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeShut-D.svg" 
                             alt="Eye Closed Icon" 
                             class="hidden dark:block" />
                    {/if}
                </button>
                <div class="font-BarlowLight  text-greyed-light dark:text-offWhite-light text-sm">
                    {#if collapsedStates.myLoans}
                        <span transition:fade>Summary</span> 
                    {/if}
                    
                </div>
            </div>
            <div class="rightHandGroup w-12">
                <!-- Light Mode Image -->
                <img src="/FAVLogos/FAV LOANS.svg" 
                alt="FAV Loans logo" 
                class="dark:hidden" />
       
                <!-- Dark Mode Image -->
                <img src="/FAVLogos/FAV LOANS rev.svg" 
                alt="FAV Loans logo" 
                class="hidden dark:block" />
            </div>
        </div>
        {#if collapsedStates.myLoans}
            <!-- section column headings -------------------------------------------->
            <div transition:slide class="sectionColumns px-3 grid grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
                <div class="column1 w-12">Contracts</div>
                <div class="column2  ">Payment(s) due</div>
                <div class="column3 ">Total debt</div>
                <div class="column4 "></div>
                <div class="column5 "></div>
            </div>
        {:else}
            <!-- section column headings -------------------------------------------->
            <div transition:slide class="sectionColumns xs:py-1 max-w-[600px] px-3 grid xs:grid-cols-[80px_0.5fr_0.8fr_0.7fr_0.6fr_55px] grid-cols-5 gap-x-3 border-opacity-0 items-center text-center font-BarlowLight text-xs">
                <div class="column1">Loan ID</div>
                <div class="column2  ">Loan amount</div>
                <div class="column3 hidden xs:block">Remaining term</div>
                <div class="column4 flex justify-center items-center">
                    <span>Payment due</span><span class="hidden sm:block">/Total</span>
                </div>                
                <div class="column5 ">Default in (days)</div>
                <div class="column6 "></div>
            </div>
        {/if}
        <Block borderColor={$themeColours['borrow'].light} pagination={false}>
            {#if Object.entries($loanNFTs).length > 0}
                <!-- collapsed summary of loans -->
                {#if collapsedStates.myLoans}
                    <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content ">
                        <button on:click={() => handleClick('myLoans')} class="sectionColumns w-full grid grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] gap-x-4 items-center text-center font-BarlowLight text-xs">                
                            <div class="column1 w-12 font-BarlowBold text-base">{getNumberOfLoans()}</div>
                            <div class="column2  font-BarlowBold text-sm ">~${_round(getTotalPaymentsPending(), 6)}</div>
                            <div class="column3 font-BarlowRegular text-sm flex justify-center items-center">
                                <span class="text-orangePrim">~${_round(getTotalLoansDebt(), 6)}
                            </div>
                            <div class="column4 "></div>
                            <div class="column5 "></div>
                        </button>
                    </div>
                {:else}

                <!-- expanded list of loans -->
                <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content space-y-4"> 
                    <!-- {#each Object.entries($walletBalances[$chainId].vaults) as [vaultName, vault]} -->
                    {#if Object.entries($loanNFTs)}
                        {#each Object.entries($loanNFTs) as [vaultName, loans]}
                            {#each loans as loan}
                                <li class="list-none">                        
                                    <div  class="loanDetails max-w-[600px] grid xs:grid-cols-[80px_0.5fr_0.8fr_0.7fr_0.6fr_55px] grid-cols-5 gap-x-3 items-center text-center font-BarlowLight text-xs"> 
                                        <div class="column1 flex justify-center items-center font-BarlowSemiBold text-sm">
                                            
                                            <div class="vaultIcon hidden xs:block"><img class="h-[30px]" src={loan.depositErc20TokenIcon} alt="Vault icon"></div>
                                            <div class="vaultIcon hidden xs:block"><img class="h-[30px]" src={loan.stablecoinTokenIcon} alt="Vault icon"></div>
                                            <div class="vaultName text-xs xs:text-sm pl-1">{loan.id}</div>
                                        </div>
                                        <div class="column2  font-BarlowRegular text-sm ">{_round(fromWei(loan.loanSize, $contractAddresses.depositErc20Decimals),7)}</div>
                                        <div class="column3 font-BarlowRegular text-sm hidden xs:block">{formatRemainingTime(loan.remainingTerm, "loans")}</div>
                                        <div class="column4 font-BarlowRegular text-sm flex justify-center items-center">
                                            <span class="text-orangePrim  ">{_round(loan.currentPaymentPending, 6)}</span><span class="hidden sm:block">/{_round(loan.remainingDebt, 6)}</span>
                                        </div>
                                        <div class="column5 font-BarlowSemiBold {loan.secondsTillLiquidation < 518400 ? 'text-orangePrim-light' : loan.secondsTillLiquidation < 950400 ? 'text-yellowPrim-light' : 'text-blackPrim-light dark:text-blackPrim-dark'}">
                                            {formatDuration(Number(loan.secondsTillLiquidation))}
                                        </div>
                                        <div class="column6 ">
                                            <Button
                                                on:buttonClicked={() => toggleButton(loan.id, vaultName)}

                                                cornerRadius={$roundedCornersSm} 
                                                textColor={loanExpandStates[loan.id] ? "text-whitePrim-light" : "text-blackPrim-light dark:text-blackPrim-dark"}
                                                
                                                font={false}
                                                textSize={false}
                                                border="border"
                                                paddingX={false}
                                                paddingY={false}
                                                backgroundColor={loanExpandStates[loan.id] ? "bg-bluePrim-light" : "bg-whitePrim-light dark:bg-whitePrim-dark"}          
                                                borderColor={loanExpandStates[loan.id] ? "border-bluePrim-light" : "border-blackPrim-light dark:border-blackPrim-dark"}
                                                type={"button"}
                                                >
                                                <span>{loanExpandStates[loan.id] ? "Collapse" : "Manage"}</span>
                                            </Button>
                                        </div>
                                    </div>
                                    {#if loanExpandStates[loan.id + "-" + vaultName]}
                                        <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content">
                                        <div class="loanManagement px-3 pt-3 border-b border-bluePrim-light">
                                            <div class="loanManageTabs flex items-center">
                                                {#if loan.remainingDebt > 0}
                                                <Button 

                                                    cornerRadius={$roundedCornersSm} 
                                                    textColor={loan.tabState === "outstanding" ? "text-whitePrim-light" : "text-whitePrim-dark dark:text-whitePrim-light"}

                                                    font="BarlowRegular"
                                                    textSize={false}        
                                                    border={false}
                                                    paddingX={false}
                                                    paddingY={false}
                                                    backgroundColor={loan.tabState === "outstanding" ? "bg-bluePrim-light" : "bg-whitePrim-light dark:bg-whitePrim-dark"}
                                                    borderColor={false} 
                                                    type={"button"}
                                                
                                                    on:buttonClicked={() => toggleLoanManageTabs(loan.id, loan.vault, "outstanding")}>
                                                    Outstanding
                                                </Button>
                                                <Button 

                                                    cornerRadius={$roundedCornersSm}
                                                    textColor={loan.tabState === "fullyRepay" ? "text-whitePrim-light" : "text-whitePrim-dark dark:text-whitePrim-light"}

                                                    font="BarlowRegular"
                                                    textSize={false}        
                                                    border={false}
                                                    paddingX={false}
                                                    paddingY={false}
                                                    backgroundColor={loan.tabState === "fullyRepay" ? "bg-bluePrim-light" : "whitePrim-light dark:whitePrim-dark"}
                                                    borderColor={false} 
                                                    type={"button"}

                                                    on:buttonClicked={() => toggleLoanManageTabs(loan.id, loan.vault,"fullyRepay")}>
                                                    Fully repay
                                                    
                                                </Button>
                                                {:else}
                                                <Button 
                                                
                                                    cornerRadius={$roundedCornersSm} 
                                                    textColor={loan.tabState === "finish" ? "text-whitePrim-light" : "text-whitePrim-dark dark:text-whitePrim-light"}
                                                    textSize={false}
                                                    font="BarlowRegular"
                                                    border={false}
                                                    paddingX={false}
                                                    paddingY={false}
                                                    backgroundColor={loan.tabState === "finish" ? "bg-bluePrim-light" : "whitePrim-light dark:whitePrim-dark"}
                                                    borderColor={false}  
                                                    type={"button"}                                          

                                                on:buttonClicked={() => toggleLoanManageTabs(loan.id, loan.vault, "finish")}>
                                                    Finish
                                                </Button>
                                                {/if}
                                            </div>
                                            <form id="manangeLoanAction" on:submit|preventDefault={() => handleLoanManageAction(loan.vault, loan.id, loan.tabState)}>
                                                <div class="contentArea">
                                                        {#if loan.tabState === "outstanding"}
                                                            <span class="font-BarlowRegular text-xs px-2">
                                                                <div> Settle your outstanding balance of <span class="text-bluePrim-light">{_round(loan.currentPaymentPending, 7)}</span> <span class="text-bluePrim-light">{loan.stablecoin}</span> to reset the Liquidation Timer.</div>
                                                            </span>
                                                            <PaymentInputField 
                                                                on:input={(event) => updateManagementButtons(event.detail, loan.vault, loan.id)}
                                                                on:autoFillClicked={(event) => updateManagementButtons(event.detail, loan.vault, loan.id)}
                                                                
                                                                textColor={false}
                                                                inputField={true}
                                                                cornerRadius={$roundedCornersSm}
                                                                leftFooterText={true}
                                                                leftFooterTextLabel={"Balance " + ($walletBalances[$chainId]?.vaults?.[loan.vault]?.tokens?.["Stablecoin"]?.balance ?? 'Loading...')}
                                                                rightFooterText={true}
                                                                rightFooterTextLabel="OUTSTANDING"
                                                                tokenSelection={true}
                                                                token={loan.stablecoinTokenIcon}
                                                                inputPlaceholderValue = "0"
                                                                textLabel={loan.stablecoin}
                                                                dropDownArrow={false}
                                                                autoFillFigure={loan.currentPaymentPending}  
                                                            ></PaymentInputField>
                                                        {:else if loan.tabState === "fullyRepay"}
                                                            <div class="font-BarlowRegular text-xs px-2 py-2">
                                                                <div>Your loan is currently worth  <span class="text-bluePrim-light">{_round(Number(fromWei($exchangeRates[loan.vault].pricePerCoin,$contractAddresses.depositErc20Decimals))*Number(fromWei(loan.loanSize, $contractAddresses.depositErc20Decimals)),7)} {loan.stablecoin}</span>, fully repay to realise it's full value today.</div>
                                                                <div> Your total outstanding debt is <span class="text-bluePrim-light">{_round(loan.remainingDebt, 8)} {loan.stablecoin}.</span> </div>
                                                                <div>Your early repayment fee is  <span class="text-bluePrim-light"> {_round(loan.earlyRepaymentFee, 8)} {loan.stablecoin}.</span></div>
                                                                <div>Settle the remainder of your entire loan with a single payment of <span class="text-bluePrim-light">{_round(loan.earlySettlementFigure, 8)} {loan.stablecoin}.</span></div> 
                                                                <div class="text-bluePrim-light">To receive your full token settlement you must complete the steps in the Finish tab which will appear upon fully repaying your loan.</div> 

                                                            </div>
                                                        {:else if loan.tabState === "finish"}
                                                            <div class="font-BarlowRegular text-xs px-2 py-2">
                                                                <div> In order to receive your full token settlement you must <span class="text-bluePrim-light">Approve</span> then <span class="text-bluePrim-light">Finalise</span> your loan contract using the button below. </div>
                                                                <div> Your loan NFT must be held in the same wallet you intend to receive your tokens in, this will automatically be sent back to FAV to finalise the loan. </div>                   
                                                            </div>
                                                        {/if}                               
                                                </div>
                                                <div class="actionButton pb-2 flex justify-center items-center">
                                                    
                                                        <Button                                                         
                                                            cornerRadius={$roundedCornersSm}
                                                            textColor="text-whitePrim-light"
                                                            textSize="text-sm"

                                                            font="BarlowBold"
                                                            border={false}
                                                            paddingX={false}
                                                            paddingY={false}
                                                            backgroundColor="bg-bluePrim-light"
                                                            borderColor={false}  
                                                            type="Submit"   
                                                            
                                                            >
                                                            {#if loan.tabState === "outstanding"}
                                                                {$loanManagementButtonLabels[loan.vault]?.[loan.id]?.payOutstanding || 'Pay'}
                                                            {:else if loan.tabState === "fullyRepay"}
                                                            {$loanManagementButtonLabels[loan.vault]?.[loan.id]?.fullyRepay || 'Pay'}
                                                            {:else if loan.tabState === "finish"}
                                                                {$finaliseLoanButtonLabel[loan.vault][loan.id]}
                                                            {/if}
                                                        </Button>
                                                    
                                                </div>
                                            </form>                       
                                        </div>
                                        </div>
                                    {/if}
                                
                                </li>
                            {/each}
                        {/each}
                    {:else}
                    Content loading...
                    {/if}
                </div>
                {/if}
            {:else}
            No loans to show just yet...
            {/if}
        </Block>
    </div>
    
    <!-- My vaults ------------------------------------------------------------------>
    <div class="sectionMain w-full text-blackPrim-light dark:text-blackPrim-dark min-w-[200px] max-w-[600px] h-auto">
        <div class="sectionHeader flex px-3 justify-between pb-2 items-center">
            <div class="leftHandGroup flex gap-x-1 items-center">
                <div class="font-BarlowSemiBold">
                    My vaults
                </div>
                <button class="eyeOpenShut w-5" on:click={() => handleClick('myVaults')}>
                    {#if collapsedStates.myVaults}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeOpen.svg" 
                             alt="Eye Open Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeOpen-D.svg" 
                             alt="Eye Open Icon" 
                             class="hidden dark:block" />
                    {:else}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeShut.svg" 
                             alt="Eye Closed Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeShut-D.svg" 
                             alt="Eye Closed Icon" 
                             class="hidden dark:block" />
                    {/if}
                </button>
                <div class="font-BarlowLight  text-greyed-light dark:text-offWhite-light text-sm">
                    {#if collapsedStates.myVaults}
                        <span transition:fade>Summary</span> 
                    {/if}
                    
                </div>
            </div>
            <div class="rightHandGroup w-12">
                <!-- Light Mode Image -->
                <img src="/FAVLogos/FAV EARN.svg" 
                alt="FAV Earn logo" 
                class="dark:hidden" />
        
                <!-- Dark Mode Image -->
                <img src="/FAVLogos/FAV EARN rev.svg" 
                alt="FAV Earn logo" 
                class="hidden dark:block" />
            </div>
        </div>
        <!-- section column headings -------------------------------------------->
        {#if collapsedStates.myVaults}
        <div transition:slide class="sectionColumns px-3 grid grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
            <div class="column1 w-12">Vaults</div>
            <div class="column2  ">Total amount</div>
            <div class="column3 "></div>
            <div class="column4 "></div>
            <div class="column5 "></div>
        </div>
        {:else}
        <div transition:slide class="sectionColumns px-3 grid grid-cols-[1fr_0.5fr_0.5fr_0.7fr_0.75fr_60px] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
            <div class="column1 ">Vault</div>
            <div class="column2  ">Amount</div>
            <div class="column3 ">Current APY</div>
            <div class="column4 hidden xs:block">Vault utilisation</div>
            <div class="column5 ">Redeemable</div>
            <div class="column6 "></div>
        </div>
        {/if}
        
        <Block borderColor={$themeColours['earn'].light} pagination={false}>
        {#if Object.keys($walletBalances).length > 0}
             <!-- collapsed summary of vaults -->
            {#if collapsedStates.myVaults}
                <button on:click={() => handleClick('myVaults')} class="sectionColumns w-full grid grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] gap-x-4 items-center text-center font-BarlowLight text-xs">                
                    <div class="column1 w-12 font-BarlowBold text-base">{getNumberOfFAVStables()}</div>
                    <div class="column2  font-BarlowBold text-sm ">

                        {_round(getTotalFAVStables(), 5)}

                    </div>
                    <div class="column3  font-BarlowRegular text-sm"></div>
                    <div class="column4 "></div>
                    <div class="column5 "></div>
                </button>
            {:else}
                <!-- expanded list of vaults -->
                <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content space-y-4"> 
                    {#if $walletBalances[$chainId] && $walletBalances[$chainId].vaults}
                        {#each Object.entries($walletBalances[$chainId].vaults) as [vaultName, vault]}
                            {#if vault.tokens["Mortgage Pool"].balance > 0}
                                <li class="list-none ">                        
                                    <div  class="loanDetails max-w-[600px] grid grid-cols-[1fr_0.5fr_0.5fr_0.7fr_0.75fr_60px] gap-x-4 items-center text-center font-BarlowLight text-xs"> 
                                        <div class="column1 flex justify-center gap-1 items-center font-BarlowSemiBold text-sm">
                                            <div class="vaultName text-xs xs:text-xs ">{vaultName}</div>
                                            <div class="vaultIcon hidden xs:block"><img class="h-[30px]" src={mortgageContractsInfo[$chainId].vaults[vaultName].coreContracts["Mortgage Pool"].tokenIcon} alt="Vault icon"></div>                                    
                                        </div>
                                        <div class="column2 font-BarlowRegular text-sm ">{vault.tokens["Mortgage Pool"].balance}</div>
                                        <div class="column3 font-BarlowRegular text-sm ">{"..."}</div>
                                        <div class="column4 font-BarlowRegular text-sm hidden xs:block">{"..."}</div>
                                        <div class="column5 font-BarlowRegular text-sm ">{"..."}</div>
                                        <div class="column6 ">
                                            <Button 
                                                on:buttonClicked={() => goToUrl("earn", "vaults")}

                                                cornerRadius={$roundedCornersSm} 
                                                textColor={"text-whitePrim-dark dark:text-whitePrim-light"}

                                                font={false}
                                                textSize={false}
                                                border="border"
                                                paddingX={false}
                                                paddingY={false}
                                                backgroundColor={"bg-whitePrim-light dark:bg-whitePrim-dark"}
                                                borderColor={"border-blackPrim-light dark:border-blackPrim-dark"}
                                                type={"button"}
                                                >
                                                <span>Manage</span>
                                            </Button>
                                        </div>
                                    </div>                                
                                </li>
                            {/if}                            
                        {/each}
                    {:else}
                    Content loading ...
                    {/if}
                    
                </div>

            {/if}
        {:else}
        No FAV stablcoin balances to show yet...
        {/if}
        </Block>
    </div>

    <!-- My IOUs ------------------------------------------------------------------>
    <div class="sectionMain text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px] h-auto">
        <div class="sectionHeader flex px-3 justify-between pb-2 items-center">
            <div class="leftHandGroup items-center flex gap-x-1 ">
                <div class="font-BarlowSemiBold">
                    My IOUs
                </div>
                <button class="eyeOpenShut w-5" on:click={() => handleClick('myIOUs')}>
                    {#if collapsedStates.myIOUs}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeOpen.svg" 
                             alt="Eye Open Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeOpen-D.svg" 
                             alt="Eye Open Icon" 
                             class="hidden dark:block" />
                    {:else}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeShut.svg" 
                             alt="Eye Closed Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeShut-D.svg" 
                             alt="Eye Closed Icon" 
                             class="hidden dark:block" />
                    {/if}
                </button>
                <div class="font-BarlowLight  text-greyed-light dark:text-offWhite-light text-sm">
                    {#if collapsedStates.myIOUs}
                        <span transition:fade>Summary</span> 
                    {/if}
                    
                </div>
            </div>
            <div class="rightHandGroup w-12">
                <!-- Light Mode Image -->
                <img src="/FAVLogos/FAV EARN.svg" 
                alt="FAV Earn logo" 
                class="dark:hidden" />
        
                <!-- Dark Mode Image -->
                <img src="/FAVLogos/FAV EARN rev.svg" 
                alt="FAV Earn logo" 
                class="hidden dark:block" />
            </div>
        </div>
        <!-- section column headings -------------------------------------------->
        {#if collapsedStates.myIOUs}
            <div transition:slide class="sectionColumns px-3 grid grid-cols-[40px_1fr_1fr_1fr] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
                <div class="column1 w-12">IOUs</div>
                <div class="column2  "></div>
                <div class="column3 ">Total amount</div>
                <div class="column4 ">Redeemable</div>
                <div class="column5 invisible xs:visible"></div>
            </div>
        {:else}
            <div transition:slide class="sectionColumns px-3 grid grid-cols-[120px_1fr_1fr_60px] gap-x-4 justify-center border-opacity-0 items-center text-center font-BarlowLight text-xs">            
                <div class="column1">Token</div>
                <div class="column2  ">Amount</div>
                <div class="column3 ">Redeemable</div>
                <div class="column4 "></div>
            </div>
        {/if}
        
        <Block borderColor={$themeColours['earn'].light}>
            {#if $redeemableIOUBalances.length > 0}
                {#if collapsedStates.myIOUs}
                    <button on:click={() => handleClick('myIOUs')} class="sectionColumns w-full grid grid-cols-[40px_1fr_1fr_1fr] gap-x-4 items-center text-center font-BarlowLight text-xs">                
                        <div class="column1 w-12 font-BarlowBold text-base">{$redeemableIOUBalances.length}</div>
                        <div class="column2 flex justify-center items-center font-BarlowBold text-sm ">   
                            {#each $redeemableIOUBalances.slice(0, 3) as IOU} <!-- Display only the first 3 items -->             
                                    <img class="h-[30px]" src={IOU.tokenIcon} alt="wBTC-DAI Claim token">
                            {/each}
                            {#if $redeemableIOUBalances.length > 3}
                                <div class="font-BarlowBold">+{$redeemableIOUBalances.length - 3}</div> <!-- Display count of additional icons -->
                            {/if}              
                        </div>
                        
                        <div class="column3  font-BarlowRegular text-sm">~${_round(getTotalIOUs(),7)}</div>
                        <div class="column4 font-BarlowRegular text-sm">{getRedeemablePercentage()}</div>
                        <div class="column5 invisible xs:visible"></div>
                    </button>
                {:else}

                <!-- expanded list of IOUs --> 
                    
                <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content space-y-4"> 
                    {#if $redeemableIOUBalances}
                        {#each $redeemableIOUBalances as IOU}

                                <li class="list-none ">                        
                                    <div class="IOUDetails max-w-[600px] grid grid-cols-[120px_1fr_1fr_60px] gap-x-4 items-center text-center font-BarlowLight text-xs"> 
                                        <div class="column1 flex justify-center gap-1 items-center font-BarlowSemiBold text-sm">
                                            <div class="vaultIcon hidden xs:block"><img class="h-[30px]" src={IOU.tokenIcon} alt="Vault icon"></div>
                                            <div class="vaultName text-xs xs:text-sm ">{IOU.ticker}</div>
                                                                                
                                        </div>
                                        <div class="column2 font-BarlowRegular text-sm ">{IOU.available}</div>
                                        <div class="column3 font-BarlowRegular text-sm ">{_round(IOU.redeemable,7)}</div>
                                        <div class="column4 ">
                                            <Button 
                                                on:buttonClicked={() => goToUrl("earn", "redeemIOUs")}

                                                cornerRadius={$roundedCornersSm} 
                                                textColor={"text-whitePrim-dark dark:text-whitePrim-light"}

                                                font={false}
                                                textSize={false}
                                                border="border"
                                                paddingX={false}
                                                paddingY={false}
                                                backgroundColor={"bg-whitePrim-light dark:bg-whitePrim-dark"}
                                                borderColor={"border-blackPrim-light dark:border-blackPrim-dark"}
                                                type={"button"}
                                                >
                                                <span>Manage</span>
                                            </Button>
                                        </div>
                                    </div>                 
                                </li>

                        {/each}
                    {/if}
                </div>
                {/if}
            {:else}
            No redeemable IOUs to show yet...
            {/if}
        </Block>

       
    </div>

    <!-- Pending conversions ------------------------------------------------------------------>
    <div class="sectionMain text-blackPrim-light dark:text-blackPrim-dark w-full min-w-[200px] max-w-[600px] h-auto">
        <div class="sectionHeader flex px-3 justify-between items-center pb-2">
            <div class="leftHandGroup flex gap-x-1 items-center">
                <div class="font-BarlowSemiBold">
                    Pending conversions
                </div>
                <button class="eyeOpenShut w-5" on:click={() => handleClick('pendingConversions')}>
                    {#if collapsedStates.pendingConversions}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeOpen.svg" 
                             alt="Eye Open Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeOpen-D.svg" 
                             alt="Eye Open Icon" 
                             class="hidden dark:block" />
                    {:else}
                        <!-- Light Mode Image -->
                        <img src="/artwork/EyeShut.svg" 
                             alt="Eye Closed Icon" 
                             class="dark:hidden" />
                    
                        <!-- Dark Mode Image -->
                        <img src="/artwork/EyeShut-D.svg" 
                             alt="Eye Closed Icon" 
                             class="hidden dark:block" />
                    {/if}
                </button>
                <div class="font-BarlowLight  text-greyed-light dark:text-offWhite-light text-sm">
                    {#if collapsedStates.pendingConversions}
                        <span transition:fade>Summary</span> 
                    {/if}
                    
                </div>
            </div>
            <div class="rightHandGroup w-12">
                <!-- Light Mode Image -->
                <img src="/FAVLogos/FAV SWAPS.svg" 
                alt="FAV Earn logo" 
                class="dark:hidden" />
        
                <!-- Dark Mode Image -->
                <img src="/FAVLogos/FAV SWAPS rev.svg" 
                alt="FAV Earn logo" 
                class="hidden dark:block" />
            </div>
        </div>
        <!-- section column headings -------------------------------------------->
        {#if collapsedStates.pendingConversions}
            <div transition:slide class="sectionColumns px-3 grid grid-cols-[40px_1fr_1fr_1fr] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
                <div class="column1 w-12">IOUs</div>
                <div class="column2"></div>
                <div class="column3 ">Total expected</div>
                <div class="column4 ">Next available</div>
                <div class="column5 invisible xs:visible"></div>
            </div>
        {:else}
            <div transition:slide class="sectionColumns px-3 grid grid-cols-[120px_0.75fr_1fr_0.75fr_60px] gap-x-4 border-opacity-0 items-center text-center font-BarlowLight text-xs">            
                <div class="column1">Vault</div>
                <div class="column2">Amount sold</div>
                <div class="column3 ">Amount expected</div>
                <div class="column4 ">Remaining time</div>
                <div class="column5 "></div>
            </div>
        {/if}
        
        <Block borderColor={$themeColours['convert'].light} pagination={false}>
            {#if $redeemableNFTs.length > 0}
                {#if collapsedStates.pendingConversions}
                    <button on:click={() => handleClick('pendingConversions')} class="sectionColumns w-full grid grid-cols-[40px_1fr_1fr_1fr] gap-x-4 items-center text-center font-BarlowLight text-xs">                
                        <div class="column1 w-12 font-BarlowBold text-base">{$redeemableNFTs.length}</div>
                        <div class="column2 flex justify-center items-center font-BarlowBold text-sm ">
                            {#each $redeemableNFTs.slice(0, 3) as IOU} <!-- Display only the first 3 items -->             
                                    <img class="h-[30px]" src={IOU.tokenIcon} alt="wBTC-DAI Claim token">
                            {/each}
                            {#if $redeemableNFTs.length > 3}
                                <div class="font-BarlowBold">+{$redeemableNFTs.length - 3}</div> <!-- Display count of additional icons -->
                            {/if} 
                        </div>
                        <div class="column3  font-BarlowRegular text-sm">~${_round(fromWei(getTotalExpectedConversions(), 18),7)} USD</div>
                        <div class="column4 font-BarlowRegular text-sm">{getShortestRemainingTime($redeemableNFTs)}</div>
                        <div class="column5 invisible xs:visible"></div>
                    </button>
                {:else}
                <!-- expanded list of pending conversions --> 
                    
                <div transition:slide={{ duration: 300, easing: cubicInOut }} class="content space-y-4"> 
                    {#each $redeemableNFTs as conversion}
                        <li class="list-none ">                        
                            <div  class="IOUDetails max-w-[600px] grid grid-cols-[120px_0.75fr_1fr_0.75fr_60px] gap-x-4 items-center text-center font-BarlowLight text-xs"> 
                                <div class="column1 flex justify-center gap-1 items-center font-BarlowSemiBold text-sm">
                                    <div class="vaultIcon hidden xs:block"><img class="h-[30px]" src={conversion.tokenIcon} alt="Vault icon"></div>  
                                    <div class="vaultName text-xs xs:text-sm ">{conversion.vaultName}</div>
                                                                      
                                </div>
                                <div class="column2 font-BarlowRegular text-sm ">{_round(conversion.amountSold,7)}</div>
                                <div class="column3 font-BarlowRegular text-sm ">{_round(fromWei(conversion.amountExpected, conversion.stablecoinDecimals),7)}</div>
                                <div class="column4 font-BarlowRegular text-sm ">{formatRemainingTime(conversion.remainingTime, "pendingConversions")}</div>
                                <div class="column5 ">
                                    <Button                                 
                                        on:buttonClicked={() => goToUrl("convert", "pendingConversions")}

                                        cornerRadius={$roundedCornersSm} 
                                        textColor={"text-whitePrim-dark dark:text-whitePrim-light"}

                                        font={false}
                                        textSize={false}
                                        border="border"
                                        paddingX={false}
                                        paddingY={false}
                                        backgroundColor={"bg-whitePrim-light dark:bg-whitePrim-dark"}
                                        borderColor={"border-blackPrim-light dark:border-blackPrim-dark"}
                                        type={"button"}
                                        >
                                        <span>Manage</span>
                                    </Button>
                                </div>
                            </div>                 
                        </li>
                    {/each}
                </div>
                {/if}
            {:else}
            No conversions pending just yet...
            {/if}
        </Block>
        
    </div>
</div>




