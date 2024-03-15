import { writable } from 'svelte/store';

export const pages = writable(['dashboard', 'borrow', 'earn', 'convert', 'system', 'docs']);
export const currentPage = writable('dashboard'); // default page


export const themeColours = writable({
    'borrow': {
        light: 'bluePrim-light',
        dark: 'bluePrim-dark'
    },
    'dashboard': {
        light: 'navyPrim-light',
        dark: 'navyPrim-dark'
    },
    'earn': {
        light: 'yellowPrim-light',
        dark: 'yellowPrim-dark'
    },
    'convert': {
        light: 'orangePrim-light',
        dark: 'orangePrim-dark'
    },
    'system': {
        light: 'navyPrim-light',
        dark: 'navyPrim-dark'
    },
    'docs': {
        light: 'blackPrim-light',
        dark: 'blackPrim-dark'
    }
});

export const roundedCornersSm = writable('rounded-md');
export const roundedCornersLg = writable('rounded-2xl');
export const dropShadow = writable('drop-shadow-xl');
