<script>
    import { currentPage, themeColours } from '../../project/js/stores/brandAndTheme';
    import { createEventDispatcher } from 'svelte';

    export let borderColor;
    export let backgroundColor;
    export let cornerRadius;
    export let textColor;
    export let textSize;
    export let font;
    export let border;
    export let paddingX;
    export let paddingY;
    export let type;

    const dispatch = createEventDispatcher();

    let buttonClass = '';

    $: {
        const theme = $themeColours[$currentPage] || { light: 'bluePrim-light', dark: 'bluePrim-light' };
        buttonClass = `
            ${cornerRadius || ''}
            ${textColor || `text-${theme.light}`}
            ${font || 'font-BarlowRegular'}
            ${textSize || 'text-xs'}
            ${border || 'border-none'}
            dark:border-opacity-60
            ${paddingX || 'px-2'}
            ${paddingY || 'py-1'}
            leading-none
            ${backgroundColor || `bg-${theme.light}`}
            ${borderColor || `border-${theme.light}`}
        `.trim();
    }

    function handleClick() {
        dispatch('buttonClicked');
    }
</script>

<button type={type || 'button'} class={buttonClass} on:click={handleClick}>
    <slot></slot>
</button>
