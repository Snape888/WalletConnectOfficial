<script>
    // Svelte imports
    import { createEventDispatcher } from 'svelte';

    // Boilerplate js files
    import { logicalPropertiesHorizontalSlide, horizontalSlide } from '../js/transitions'

    // Project specific imports
    import { pages, currentPage, themeColours, roundedCornersSm, roundedCornersLg, dropShadow } from '../../project/js/stores/brandAndTheme';
    
    export let visible;

	let showVertical = false;
	let showHorizontal = false;

    export let tokenList;
    export let title;


    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    const dispatch = createEventDispatcher();

    function tokenSelected(tokenSelection) {

        console.log("tokenSelection (pre) = ", tokenSelection);

        if (tokenSelection > -1){
            dispatch('tokenSelected', tokenSelection);
        }else{
            tokenSelection=-1;
            visible=false;
        }        

        console.log("tokenSelection (post) = ", tokenSelection)
 
    }

</script>

{#if visible}
    {showVertical = !showVertical}  
    <div transition:horizontalSlide={{axis: 'x', duration: 300}} class="fixed inset-0 bg-blackPrim-light bg-opacity-50 flex justify-center items-center z-50">
        <!-- Your popup content goes here -->
        <button id="background" class="bg-offWhite-light w-full h-full flex justify-center items-center rounded-lg shadow-xl" on:click={()=>tokenSelected()}>
            <div id="container" class="bg-whitePrim-light {$roundedCornersLg} p-5 min-w-[450px] max-w-[650px] cursor-default">
                <span class=" pl-7 font-BarlowSemiBold">{title}</span>
                <div class="leftHandGroup flex flex-col items-center">
                    <ul class="list-none space-y-4 py-4 max-w-max h-64 overflow-y-auto no-scrollbar">
                        {#each tokenList as token}
                            {#if token != ""}
                                <li class="overflow-hidden">
                                    <button type="button" class="tokenSelection whitespace-nowrap flex items-center gap-x-2" on:click|stopPropagation={()=>tokenSelected(token.id)}>
                                        {#if token.tokenIcon != ""}
                                            <img src={token.tokenIcon} alt="{token.token} icon" class="w-6 h-6">
                                        {/if}
                                        {#if token.ticker != ""}
                                            <span class="textLabel mt-0.5 font-BarlowSemiBold {token.tokenGreyed === true ? 'text-greyed' : 'text-blackPrim'}">
                                                {token.ticker}
                                            </span>
                                        {/if}
                                        {#if token.available != ""}
                                            <span class="textLabel mt-0.5 font-BarlowRegular {token.availableGreyed === true ? 'text-greyed' : 'text-blackPrim'}">
                                                {token.available}
                                            </span>
                                        {/if}
                                        {#if token.repayInToken != ""}
                                            <span class="textLabel mt-0.5 font-BarlowRegular {token.repayInTokenGreyed === true ? 'text-greyed' : 'text-blackPrim'}">
                                                {token.repayInToken}
                                            </span>
                                        {/if}
                                        {#if token.feeNote != ""}
                                            <span class="textLabel mt-0.5 font-BarlowRegular {token.feeNoteGreyed === true ? 'text-greyed' : 'text-blackPrim'}">
                                                {token.feeNote}
                                            </span>
                                        {/if}
                                    </button>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            </div>  
        </button>
    </div>
{/if}

<!-- CREATION TEMPLATE -->
<!--
    Use this template as a guide to implement Block component with all available configuration options:

    <TokenSelection
        visible={showVaultSelection} 
        tokenList={$vaultFilter}
        title="Filter vault"
        on:tokenSelected={findVaultById}      
    ></TokenSelection>

-->
