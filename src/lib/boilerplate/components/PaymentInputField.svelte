<script>

    // Svelte imports
    import { createEventDispatcher } from 'svelte';

    // Project specific imports
    import { currentPage, themeColours} from '../../project/js/stores/brandAndTheme';

    // input field value
    export let value ="";
    export let inputDisabled = false;

    
    // Top Left section options
    export let tokenSelection = false; //section toggle
    export let token="";
    export let textLabel = "";
    export let textLabelGreyed = "";
    // export let tokenSelector = false;
    export let dropDownArrow = false;

    // Top right section options
    export let inputField = false; //section toggle
    export let inputPlaceholderValue =""; 

    //Bottom left section options
    export let leftFooterText = false; //section toggle
    export let leftFooterTextLabel = "";

    //Bottom right section options
    export let rightFooterText = false; //section toggle
    export let rightFooterTextLabel = "";
    export let autoFillFigure = false;
    export let disableRightFooterClick = false;

    //styling optons
    export let cornerRadius;
    export let textColor;

    

    function handleInput(event) {
        const validValue = event.target.value.match(/^\d*\.?\d*$/);
        if (validValue) {
            dispatch('input', value);
        }
    }

    // 8 possible layouts options
    // Function to determine layout
    function determineLayout() {
    // Layout 1: Everything is showing
    if (tokenSelection && inputField && leftFooterText && rightFooterText) {
        return 'layout1';
    }

    // Layout 2: No leftFooterText
    if (tokenSelection && inputField && rightFooterText && !leftFooterText) {
        return 'layout2';
    }

    // Layout 3: No rightFooterText
    if (tokenSelection && inputField && leftFooterText && !rightFooterText) {
        return 'layout3';
    }

    // Layout 4: Only tokenSelection is showing
    if (tokenSelection && !inputField && !leftFooterText && !rightFooterText) {
        return 'layout4';
    }

    // Layout 5: Only inputField is showing
    if (!tokenSelection && inputField && !leftFooterText && !rightFooterText) {
        return 'layout5';
    }

    // Layout 6: Only tokenSelection and inputField are showing
    if (tokenSelection && inputField && !leftFooterText && !rightFooterText) {
        return 'layout6';
    }

    // Layout 7: Only leftFooterText is showing
    if (!tokenSelection && !inputField && leftFooterText && !rightFooterText) {
        return 'layout7';
    }

    // Layout 8: Only rightFooterText is showing
    if (!tokenSelection && !inputField && !leftFooterText && rightFooterText) {
        return 'layout8';
    }

    // Layout 9: No inputField
    if (tokenSelection && !inputField && leftFooterText && rightFooterText) {
    return 'layout3';
    }

    // Layout 10: No tokenSelection
    if (!tokenSelection && inputField && leftFooterText && rightFooterText) {
    return 'layout3';
    }

    // Default layout (in case none of the above conditions are met)
    return 'defaultLayout';
}


// Reactive statement to re-evaluate layout when options change
$: currentLayout = determineLayout();

let isFocused = false;

function handleFocus() {
    isFocused = true;
    // console.log(`${$themeColours[$currentPage]}`);
}

function handleBlur() {
    isFocused = false;
}

function handleAutoFill() {
    if (autoFillFigure){
        const balanceFigure = autoFillFigure;   
        const balanceNumber = extractNumberFromString(balanceFigure);    
        value = balanceNumber; // Update the value variable
        dispatch('autoFillClicked', value); 
    }else{
        const balanceFigure = leftFooterTextLabel;  
        const balanceNumber = extractNumberFromString(balanceFigure); 
        value = balanceNumber; // Update the value variable
        dispatch('autoFillClicked', value);
    }
}

function extractNumberFromString(str) {
    const matches = str.match(/(\d+(\.\d+)?)/);
    return matches ? matches[0] : null;
}


const dispatch = createEventDispatcher();

function handleDropdown() {
    dispatch('dropDownClicked');
    // console.log("dispatched");

}


$: paymentFieldClass = isFocused
    ? `border border-${$themeColours[$currentPage].light}` // Class for focused state
    : 'border border-blackPrim'; // Default class


</script>

<div id="paymentInputField" class={`paymentInputField ${paymentFieldClass} ${cornerRadius} ${textColor ? `${textColor}` : `text-blackPrim-light dark:text-blackPrim-dark`} border border-blackPrim-light w-full my-3 px-3 py-1 bg-offWhite-light dark:bg-offWhite-dark`}>
    {#if currentLayout === 'layout1'}
    <div class="Layout1">
        <div class={`upperElements flex justify-between`}>
            <div class="leftHandGroup flex gap-x-1 justify-center items-center">
                {#if token != ""}
                <div class="tokenSelection w-6 h-6"><img src={token} alt="Token icon"></div>
                {/if}
                {#if textLabel != ""}
                    <div class="textLabel mt-0.5 font-BarlowSemiBold flex items-center justify-center">{textLabel}
                        {#if textLabelGreyed != ""}
                        <span class="font-BarlowRegular text-greyed">&nbsp;{textLabelGreyed}</span>
                        {/if}
                    </div>
                {/if}            
                {#if dropDownArrow}
                <button type="button" on:click={handleDropdown} class="dropDownArrow w-4 h-4 flex justify-center items-center" >
                    <!-- Light Mode Image -->
                    <img src="/artwork/DropDownArrow.svg" 
                    alt="Drop Down Arrow" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/artwork/DropDownArrow-D.svg" 
                    alt="Drop Down Arrow" 
                    class="hidden dark:block" />
                </button> 
                {/if} 
                

            </div>
            <div class="rightHandGroup">

                <input type="text" class="input-number text-right bg-transparent focus:outline-none border-none" 
                    on:focus={handleFocus} on:blur={handleBlur} bind:value={value} on:input={handleInput} 
                    disabled={inputDisabled} placeholder={inputPlaceholderValue}>


            </div>
        </div>
        <div class={`lowerElements flex justify-between`}>
            <div class="leftHandGroup flex gap-x-1 justify-center items-center">

                <div class="leftHandFooterText text-xs">{leftFooterTextLabel}</div>

            </div>
            <div class="rightHandGroup">

                <button type="button" on:click={handleAutoFill} class="rightHandFooterText text-xs" disabled={disableRightFooterClick}>{rightFooterTextLabel}</button>

            </div>
        </div>
    </div>
    {:else if currentLayout === 'layout2' || currentLayout === 'layout10'}
    <div class={`Layout2-and-10 allElements flex justify-between`}>
        <div class="leftHandGroup flex gap-x-1 justify-center items-center">
            {#if token != ""}
                <div class="tokenSelection w-6 h-6"><img src={token} alt="Token icon"></div>
            {/if}
            {#if textLabel != ""}
                    <div class="textLabel mt-0.5 font-BarlowSemiBold flex items-center justify-center">{textLabel}
                        {#if textLabelGreyed != ""}
                        <span class="font-BarlowRegular text-greyed">&nbsp;{textLabelGreyed}</span>
                        {/if}
                    </div>
                {/if}            
                {#if dropDownArrow}
                <button type="button" on:click={handleDropdown} class="dropDownArrow w-4 h-4 flex justify-center items-center" >
                    <!-- Light Mode Image -->
                    <img src="/artwork/DropDownArrow.svg" 
                    alt="Drop Down Arrow" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/artwork/DropDownArrow-D.svg" 
                    alt="Drop Down Arrow" 
                    class="hidden dark:block" />
                </button> 
                {/if} 

        </div>
        <div class="rightHandGroup flex flex-col justify-end">
            <div class="rightHandGroupUpper text-right">
                <input type="text" class="input-number text-right bg-transparent focus:outline-none border-none" 
                    on:focus={handleFocus} on:blur={handleBlur} bind:value={value} on:input={handleInput} 
                    placeholder={inputPlaceholderValue}>
            </div>
            <div class="rightHandGroupLower text-right">
                <button type="button" on:click={handleAutoFill} class="rightHandFooterText text-xs" disabled={disableRightFooterClick}>{rightFooterTextLabel}</button>
            </div>
        </div>
    </div>
    {:else if currentLayout === 'layout3' || currentLayout === 'layout9'}
    <div class={`Layout3-and-9 allElements flex justify-between`}>
        <div class="leftHandGroup gap-x-1 justify-center items-center">
            <div class="leftHandGroupUpper gap-1 flex flex-row items-center justify-start">

                {#if token != ""}
                <div class="tokenSelection w-6 h-6"><img src={token} alt="Token icon"></div>
                {/if}
                {#if textLabel != ""}
                    <div class="textLabel mt-0.5 font-BarlowSemiBold flex items-center justify-center">{textLabel}
                        {#if textLabelGreyed != ""}
                        <span class="font-BarlowRegular text-greyed">&nbsp;{textLabelGreyed}</span>
                        {/if}
                    </div>
                {/if}         
                {#if dropDownArrow}
                <button type="button" on:click={handleDropdown} class="dropDownArrow w-4 h-4 flex justify-center items-center" >
                    <!-- Light Mode Image -->
                    <img src="/artwork/DropDownArrow.svg" 
                    alt="Drop Down Arrow" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/artwork/DropDownArrow-D.svg" 
                    alt="Drop Down Arrow" 
                    class="hidden dark:block" />
                </button> 
                {/if} 
                

            </div>
            <div class="leftHandGroupLower justify-start">

                <div class="leftHandFooterText text-xs">{leftFooterTextLabel}</div>

            </div>
        </div>
        <div class="rightHandGroup flex flex-col justify-center items-end">

            <input type="text" class="input-number text-right bg-transparent focus:outline-none border-none" 
                    on:focus={handleFocus} on:blur={handleBlur} bind:value={value} on:input={handleInput} 
                    disabled={inputDisabled} placeholder={inputPlaceholderValue}>

            <button type="button" on:click={handleAutoFill} class="rightHandFooterText text-xs" disabled={disableRightFooterClick}>{rightFooterTextLabel}</button>
            
        </div>
    </div>    
    {:else if currentLayout === 'layout4' || currentLayout === 'layout7'}
    <div class={`Layout4-and-7 allElements flex justify-between`}>
        <div class="leftHandGroup py-2 flex gap-x-1 justify-center items-center">

            {#if token != ""}
                <div class="tokenSelection w-6 h-6"><img src={token} alt="Token icon"></div>
            {/if}
            {#if textLabel != ""}
                    <div class="textLabel mt-0.5 font-BarlowSemiBold flex items-center justify-center">{textLabel}
                        {#if textLabelGreyed != ""}
                        <span class="font-BarlowRegular text-greyed">&nbsp;{textLabelGreyed}</span>
                        {/if}
                    </div>
                {/if}         
                {#if dropDownArrow}
                <button type="button" on:click={handleDropdown} class="dropDownArrow w-4 h-4 flex justify-center items-center" >
                    <!-- Light Mode Image -->
                    <img src="/artwork/DropDownArrow.svg" 
                    alt="Drop Down Arrow" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/artwork/DropDownArrow-D.svg" 
                    alt="Drop Down Arrow" 
                    class="hidden dark:block" />
                </button> 
                {/if} 

            <div class="leftHandFooterText text-xs">{leftFooterTextLabel}</div>

        </div>
        <div class="rightHandGroupDummy">
            <div class="dummy h-3 w-3"></div>
        </div>
    </div>
    {:else if currentLayout === 'layout5' || currentLayout === 'layout8'}
    <div class={`Layout5-and-8 allElements flex justify-between`}>
        <div class="leftHandGroupDummy flex gap-x-1 justify-center items-center">
            <div class="dummy h-3 w-3"></div>
        </div>
        <div class="rightHandGroup">
            <input type="text" class="input-number text-right bg-transparent focus:outline-none border-none" 
                    on:focus={handleFocus} on:blur={handleBlur} bind:value={value} on:input={handleInput} 
                    disabled={inputDisabled} placeholder={inputPlaceholderValue}>

            <button type="button" on:click={handleAutoFill} class="rightHandFooterText text-xs" disabled={disableRightFooterClick}>{rightFooterTextLabel}</button>
        </div>
    </div>
    {:else if currentLayout === 'layout6'}
    <div class={`Layout6 allElements flex justify-between`}>
        <div class="leftHandGroup py-2 flex gap-x-1 justify-center items-center">
           
            {#if token != ""}
                <div class="tokenSelection w-6 h-6"><img src={token} alt="Token icon"></div>
            {/if}
            {#if textLabel != ""}
                    <div class="textLabel mt-0.5 font-BarlowSemiBold flex items-center justify-center">{textLabel}
                        {#if textLabelGreyed != ""}
                        <span class="font-BarlowRegular text-greyed">&nbsp;{textLabelGreyed}</span>
                        {/if}
                    </div>
                {/if}            
                {#if dropDownArrow}
                <button type="button" on:click={handleDropdown} class="dropDownArrow w-4 h-4 flex justify-center items-center" >
                    <!-- Light Mode Image -->
                    <img src="/artwork/DropDownArrow.svg" 
                    alt="Drop Down Arrow" 
                    class="dark:hidden" />
           
                    <!-- Dark Mode Image -->
                    <img src="/artwork/DropDownArrow-D.svg" 
                    alt="Drop Down Arrow" 
                    class="hidden dark:block" />
                </button> 
                {/if} 

            <div class="leftHandFooterText text-xs">{leftFooterTextLabel}</div>
            
        </div>
        <div class="rightHandGroup rightHandGroup flex flex-col justify-center items-end">
            <div class="rightHandGroupUpper">
                <input type="text" class="input-number text-right bg-transparent focus:outline-none border-none" 
                    on:focus={handleFocus} on:blur={handleBlur} bind:value={value} on:input={handleInput} 
                    disabled={inputDisabled} placeholder={inputPlaceholderValue}>
            </div>
            <div class="rightHandGroupLower">
                <button type="button" on:click={handleAutoFill} class="rightHandFooterText text-xs" disabled={disableRightFooterClick}>{rightFooterTextLabel}</button>
            </div>
            
        </div>
    </div>
    {:else}
    <div class="dummy h-3 w-3"></div>

    {/if}
</div>


    



<style>
    /* Custom styles for the number input field */
    .input-number::-webkit-inner-spin-button,
    .input-number::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .input-number {
        -moz-appearance: textfield; /* For Firefox */
        -webkit-appearance: none; /* For Chrome, Safari, Edge */
        background-color: transparent; /* Example of using Tailwind-like utility */
        outline: none; /* Removes the focus outline */
        border: none; /* Removes the border */
        /* Add more styling as needed */
    }
</style>

<!-- CREATION TEMPLATE (copy and paste this into your page, then make changes)-->
<!-- 
<PaymentInputField

    textColor={false}
    cornerRadius={$roundedCornersSm} 

    tokenSelection={true}
    tokenSelector={true} 
    token="/defiLogos/usd-coin-usdc-logo.svg" 
    textLabel="ETH-NFT ~$3200" 
    dropDownArrow={true}

    leftFooterText={true} 
    leftFooterTextLabel="Balance: 342487.34" 

    inputField={true} 

    rightFooterText={true} 
    rightFooterTextLabel="MAX">
    autoFillFigure={false} 
    
</PaymentInputField> 
-->