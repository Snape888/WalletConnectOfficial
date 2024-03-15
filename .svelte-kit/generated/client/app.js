export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/borrow": [5],
		"/borrow/[slug]": [6],
		"/convert": [7],
		"/convert/[slug]": [8],
		"/dashboard": [9],
		"/dashboard/[slug]": [10],
		"/docs": [11],
		"/docs/[slug]": [12],
		"/earn": [13],
		"/earn/[slug]": [14],
		"/system": [15],
		"/testing": [17],
		"/test": [16],
		"/walletConnect": [18,[2]],
		"/[slug]": [4]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';