<script>
    import { createEventDispatcher } from 'svelte';
    import { themeColours, currentPage as themeCurrentPage, dropShadow, roundedCornersLg } from '../../project/js/stores/brandAndTheme';

    export let borderColor;
    export let pagination = false;
    export let totalItems = 0;
    export let itemsPerPageOptions = [10, 25, 100, 'all'];
    export let initialItemsPerPage = 10;

    const dispatch = createEventDispatcher();

    let currentPage = 1;
    let itemsPerPage = initialItemsPerPage;
    let numberOfPages;

    // Reactive statement to handle pagination calculations
    $: {
        if (itemsPerPage === 'all') {
            itemsPerPage = totalItems;
        }

        numberOfPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
        currentPage = currentPage > numberOfPages ? numberOfPages : currentPage;
    }

    function changePage(newPage) {
        if (newPage >= 1 && newPage <= numberOfPages) {
            currentPage = newPage;
            dispatch('pageChange', { currentPage, itemsPerPage });
        }
    }

    function changeItemsPerPage(newItemsPerPage) {
        itemsPerPage = newItemsPerPage === 'all' ? totalItems : +newItemsPerPage;
        currentPage = 1; // Reset to first page
        dispatch('pageChange', { currentPage, itemsPerPage });
    }

    // Reactive statement for class construction with fallback
    let blockClass = '';
    $: {
        const theme = $themeColours[$themeCurrentPage] || { light: 'default-light', dark: 'default-dark' };
        blockClass = `
            ${borderColor ? `border-${borderColor}` : `border-${theme.light}`}
            border 
            dark:border-opacity-75
            ${$dropShadow}
            ${$roundedCornersLg}
            bg-whitePrim-light dark:bg-whitePrim-dark
            w-full
            min-w-[240px]
            max-w-[600px]
            p-3 h-auto
            rounded-large
        `.trim();
    }
</script>

<div class={blockClass}>
    <slot></slot>
</div>

<!-- Pagination -->
{#if pagination}
    <div class="pagination-container flex justify-between text-sm items-center p-2">
        <!-- Page Controls -->
        <div class="page-controls flex gap-2">
            <!-- Page navigation buttons -->
            <button class="text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light" on:click={() => changePage(1)} disabled={currentPage === 1}>&lt;&lt;</button>
            <button class="text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light" on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
            <!-- Current page info -->
            <div class="page-info text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light flex items-center">
                {currentPage} ... {numberOfPages}
            </div>
            <!-- Next and last page -->
            <button class="text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light" on:click={() => changePage(currentPage + 1)} disabled={currentPage === numberOfPages}>&gt;</button>
            <button class="text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light" on:click={() => changePage(numberOfPages)} disabled={currentPage === numberOfPages}>&gt;&gt;</button>
        </div>
        
        <!-- Items per page selector -->
        <div class="items-per-page-selector flex items-center gap-2">
            {#each itemsPerPageOptions as option}
                <button class={`text-greyed-light dark:text-offWhite-light disabled:text-offWhite-light ${option === itemsPerPage ? 'font-BarlowSemiBold' : ''}`} on:click={() => changeItemsPerPage(option)}>
                    {option}
                </button>
            {/each}
        </div>
    </div>
{/if}

<!-- CREATION TEMPLATE -->
<!--
    Use this template as a guide to implement Block component with all available configuration options:

    <Block
        borderColor="colorName" 
        pagination={true} 
        totalItems={totalNumberOfItems}
        itemsPerPageOptions={[10, 25, 100, 'all']} 
        initialItemsPerPage={10} 
    >
        
    </Block>
-->
