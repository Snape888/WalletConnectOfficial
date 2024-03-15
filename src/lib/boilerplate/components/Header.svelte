<script lang="ts">
    import { account } from '$lib/web3modal'
	import { Toaster } from 'svelte-french-toast'
	import Network from '../../../partials/Network.svelte'
	import SignMessage from '../../../partials/SignMessage.svelte'
	import SignTypeData from '../../../partials/SignTypeData.svelte'
	import Transaction from '../../../partials/Transaction.svelte'
	import Wallet from '../../../partials/Wallet.svelte'
	import CustomForm from '../../../partials/CustomForm.svelte'

    // Svelte imports
    import { scale } from 'svelte/transition';
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import Countup from "svelte-countup";
    

    // Project specific imports
    import { protocolInfo, vaultLoans, systemVaults } from '../../project/js/stores/projectDynamicValues';
    import { pages, currentPage, themeColours, roundedCornersSm, roundedCornersLg } from '../../project/js/stores/brandAndTheme';


    /// Boilerplate imports
    // import Wallet from '$lib/boilerplate/components/Wallet.svelte';

    import {
        defaultLoan,
        getTVL,
        createSystemLoans
    } from '$lib/project/js/FAVfunctionCalls.ts';
    import { _round } from "$lib/boilerplate/js/core";  
    import { chainId } from '../js/stores/wallet';

    function toTitleCase(str) {
                return str.replace(/\b\w/g, letter => letter.toUpperCase());
    }


    const dispatch = createEventDispatcher();
    let isMenuOpen = false;

    const handleClick = (page) => {
        dispatch('navigate', page); // Emit an event to the parent
        isMenuOpen = false; // Close the mobile menu
    };

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    let systemTvl = 0;

    $ : if($vaultLoans.length > 0) {systemTvl = getTVL(false)};

    onMount(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Adjust 768 to match your Tailwind md breakpoint
                isMenuOpen = false;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

        
    });

    function toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark');
    }
</script>

<header>
    <div class="headerMain flex ${isMenuOpen ? 'h-auto min-h-[60px]' : 'h-[60px]'} p-5 justify-between items-center bg-whitePrim-light dark:bg-whitePrim-dark border-blackPrim-light dark:border-blackPrim-dark border-b px-5">
        <div class="left-group flex items-center gap-5">
            <!-- Hamburger Menu Button -->
            <button class="md:hidden w-5 text-center" on:click={toggleMenu}>
                <img src="/artwork/HamburgerMenu.svg" alt="hamburger menu icon" class="dark:hidden" />
                <img src="/artwork/HamburgerMenu-D.svg" alt="hamburger menu icon" class="hidden dark:block" />
            </button>

            <!-- Site Logo -->
            <a href="/" class={`siteLogo w-12 text-center ${isMenuOpen ? 'hidden' : 'block'}`} on:click={()=>{handleClick("")}}>
                <img src="/FAVLogos/FAV_LogoWord.svg" alt="FAV Logo Light" class="dark:hidden" />
                <img src="/FAVLogos/FAV_LogoWord-D.svg" alt="FAV Logo Dark" class="hidden dark:block" />
            </a>

            
            <!-- Navigation Menu -->
            <div class={`menuItems text-whitePrim-light dark:text-whitePrim-dark text-sm font-BarlowRegular ${isMenuOpen ? 'block md:flex' : 'hidden md:flex'}`}>
                {#if isMenuOpen}
                    <!-- Mobile Navigation Menu -->
                    <nav class="md:hidden">
                        <ul in:scale={{ duration: 300 }} out:scale={{ duration: 300 }}>
                            {#each $pages as page}
                                <li class="p-1 px-1.5">
                                    <a href="/{page}" on:click={()=>{handleClick(page)}} class={`${page.toLowerCase()} ${page === $currentPage ? 'active text-whitePrim-light dark:text-whitePrim-light' : 'text-blackPrim-light dark:text-whitePrim-light'} py-1 px-1.5 gap-x-2 ${$roundedCornersSm} border-2 border-transparent hover:border-2 hover:bg-whitePrim-light dark:hover:bg-whitePrim-dark hover:text-blackPrim-light dark:hover:text-blackPrim-dark hover:border-blackPrim-light dark:hover:border-blackPrim-dark ${page === $currentPage ? `bg-${$themeColours[page].light} dark:bg-${$themeColours[page].dark}` : ''}`}>
                                        {toTitleCase(page)}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </nav>
                {:else}
                    <!-- Desktop Navigation Menu -->
                    <nav>
                        <ul class="flex justify-center gap-0">
                            {#each $pages as page}
                                <li>
                                    <a href="/{page}" on:click={()=>{handleClick(page)}} class={`${page.toLowerCase()} ${page === $currentPage ? `bg-${$themeColours[page].light} active text-whitePrim-light dark:text-whitePrim-light` : 'text-blackPrim-light dark:text-whitePrim-light'} py-1 px-1.5 gap-x-2 ${$roundedCornersSm} border-2 border-transparent hover:border-2 hover:bg-whitePrim-light dark:hover:bg-whitePrim-dark hover:text-blackPrim-light dark:hover:text-blackPrim-dark hover:border-blackPrim-light dark:hover:border-blackPrim-dark`}>
                                        {toTitleCase(page)}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </nav>
                {/if}
            </div>
        </div>

        <!-- Wallet Component (Always visible) -->
        <div class="right-group flex items-center">
            <div class="text-blackPrim-light dark:text-blackPrim-dark gap-3 text-sm font-BarlowRegular flex  items-center">
                <ul class=" justify-center hidden md:flex gap-3">
                    {#each $protocolInfo as item}
                        {#if item.name === 'noEthContracts'}
                            <li>Live contracts <span class="text-blackPrim-light dark:text-blackPrim-dark font-BarlowBold">{#if $vaultLoans.length > 0}<Countup value={$vaultLoans.length}/>{/if}</span></li>
                        {:else if item.name === 'ethTVL'}
                            <li>TVL <span class="text-blackPrim-light dark:text-blackPrim-dark font-BarlowBold">{#if $systemVaults.length > 0}${_round(getTVL(false), 2)}{/if}</span></li>
                        {/if}
                    {/each}
                    

                </ul>
                <!-- Dark Mode Toggle Button -->
                <button class="w-7  p-1 border {$roundedCornersSm}"  on:click={toggleDarkMode}>
                    <img src="/artwork/DarkModeIcon.svg" alt="Dark mode icon" class="dark:hidden" />
                    <img src="/artwork/LightModeIcon.svg" alt="Light mode icon" class="hidden dark:block" />
                </button>
                <w3m-button 
                 size={"sm"}
                 balance={"hide"}
                />
                <w3m-network-button />
            </div>
        </div>
    </div>
</header>





