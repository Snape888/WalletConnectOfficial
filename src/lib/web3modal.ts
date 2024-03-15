import { defaultWagmiConfig, createWeb3Modal } from '@web3modal/wagmi'

import {
	getAccount,
	getChainId,
	reconnect,
	watchAccount,
	watchChainId,
} from '@wagmi/core'
import { readable, writable } from 'svelte/store'

import {
	mainnet,
	polygon,
} from 'viem/chains'
import { CUSTOM_WALLET } from './constants'

export const projectId = import.meta.env.VITE_PROJECT_ID

let storedCustomWallet;
if(typeof window !== 'undefined'){
	storedCustomWallet = localStorage.getItem(CUSTOM_WALLET)
}

const customWallets = storedCustomWallet ? [JSON.parse(storedCustomWallet)] : undefined

const metadata = {
	name: 'Web3Modal',
	description: 'Web3Modal Example',
	url: 'https://web3modal.com',
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const chains = [
	mainnet,
	polygon,
] as const

export const wagmiConfig = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	enableCoinbase: false,
	enableInjected: false,
})

reconnect(wagmiConfig)

createWeb3Modal({
	wagmiConfig,
	projectId,
	themeMode: 'dark',
	featuredWalletIds: [
		'1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
		'4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
	],

	enableAnalytics: true,
	customWallets,

	themeVariables: {
		'--w3m-color-mix': 'black',
		'--w3m-color-mix-strength': 0,
		'--w3m-font-family': "MyriadPro-Regular, san-serif",
		'--w3m-font-size-master': "text-sm"
	},


})

export const chainId = readable(getChainId(wagmiConfig), (set) =>
	watchChainId(wagmiConfig, { onChange: set }),
)
export const account = readable(getAccount(wagmiConfig), (set) =>
	watchAccount(wagmiConfig, { onChange: set }),
)
export const provider = readable<unknown | undefined>(
	undefined,
	(set) =>
		watchAccount(wagmiConfig, {
			onChange: async (account) => {
				if (!account.connector) return set(undefined)
				set(await account.connector?.getProvider())
			},
		}),
)

export const customWallet = writable({
	id: undefined,
	name: undefined,
	homepage: undefined,
	image_url: undefined,
	mobile_link: undefined,
	desktop_link: undefined,
	webapp_link: undefined,
	app_store: undefined,
	play_store: undefined
})

export const supported_chains = writable<string[]>([])
