<script>
    // Svelte imports
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    // Boilerplate js files
    import { logicalPropertiesHorizontalSlide, horizontalSlide } from '../js/transitions'

    // Project specific imports
    import { pages, currentPage, themeColours, roundedCornersSm, roundedCornersLg, dropShadow } from '../../project/js/stores/brandAndTheme';
    
    export let visible;

	let showVertical = false;
	let showHorizontal = false;

    export let helperName;
    export let titleCopy;
    export let bodyCopy01="";
    export let url01="";
    export let url01Name="";
    export let bodyCopy02="";
    export let url02="";
    export let url02Name="";
    export let bodyCopy03="";
    export let url03 ="";
    export let url03Name="";



    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    const dispatch = createEventDispatcher();

    function closeModal() {

        dispatch('close');
        console.log('closing modal');  
    }

</script>

{#if visible}
    <div 
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 100 }}
        id={helperName} class="fixed inset-0 flex justify-center items-center z-50">
        <button class="bg-blackPrim-light bg-opacity-50 w-full h-full shadow-xl" on:click={closeModal}></button>
        <button  class="container overflow-hidden bg-whitePrim-light opacity-100 {$roundedCornersLg} p-5 min-w-[300px] max-w-[600px] cursor-default text-center absolute" on:click={closeModal}>
            <!-- <div class=" overflow-hidden font-BarlowSemiBold pb-1.5 text-{$themeColours[$currentPage]}">FAV Tip</div> -->
            <div class="overflow-hidden font-BarlowSemiBold pb-1.5 text-{$themeColours[$currentPage].light}">{titleCopy}</div>
            <div class="bodyCopy01 flex flex-col items-center text-left font-BarlowRegular">
                {@html bodyCopy01}
            </div>
            {#if url01 !==""}
            <div class="url01 flex py-3 flex-col items-center font-BarlowRegular text-bluePrim-light">
                <a href="{url01}">{url01Name}</a>
            </div>
            {/if}
            {#if bodyCopy02 !==""}
            <div class="bodyCopy02 flex flex-col items-center font-BarlowRegular">
                {bodyCopy02}
            </div>
            {/if}
            {#if url02 !==""}
            <div class="url02 flex flex-col items-center font-BarlowBold text-bluePrim-light">
                <a href="{url02}">{url02Name}</a>
            </div>
            {/if}
            {#if bodyCopy02 !==""}
            <div class="bodyCopy03 flex flex-col items-center font-BarlowBold">
                {bodyCopy03}
            </div>
            {/if}
            {#if url03 !==""}
            <div class="url03 flex flex-col items-center font-BarlowBold text-bluePrim-light">
                <a href="{url03}">{url03Name}</a>
            </div>
            {/if}
        </button>
    </div>
{/if}


<!-- CREATION TEMPLATE -->
<!--
    Use this template as a guide to implement Block component with all available configuration options:

    <script>

    /// Boilerplate components
    import HelpMessageModal from '$lib/boilerplate/components/HelpMessageModal.svelte';

    ///Help modal -------------------------------------------------------------

        let helpModals = {
            modal01: false,
        }

        function toggleHelp(modalName){
            helpModals[modalName] = !helpModals[modalName];
        }

    ///End of Help modal ------------------------------------------------------

    </script>


    <HelpMessageModal
        visible={helpModals['modal01']} 
        helperName=""
        titleCopy=""
        bodyCopy01=""
        url01=""
        url01Name=""
        bodyCopy02=""
        url02=""
        url02Name=""
        bodyCopy03=""
        url03 =""
        url03Name=""
        on:close={() => toggleHelp('modal01')}     
    ></HelpMessageModal>

    <button class="rightHandGroup w-3 h-3 min-w-3 min-h-3 flex justify-center items-center" on:click={() => toggleHelp('modal01')}>
        <img src="/artwork/HelpIcon.svg" alt="Help icon" class="w-full h-full">
    </button>

-->