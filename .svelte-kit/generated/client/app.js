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
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/airdrop": [5],
		"/borrow": [6],
		"/borrow/[slug]": [7],
		"/convert": [8],
		"/convert/[slug]": [9],
		"/dashboard": [10],
		"/dashboard/[slug]": [11],
		"/docs": [12],
		"/docs/[slug]": [13],
		"/earn": [14],
		"/earn/[slug]": [15],
		"/system": [16],
		"/test2": [18],
		"/testing": [19],
		"/test": [17],
		"/walletConnect": [20,[2]],
		"/[slug]": [4]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';