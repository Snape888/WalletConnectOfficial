<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';
	import { EthereumProvider } from '@walletconnect/ethereum-provider';
	import { onMount } from 'svelte';
	import Wallet from '../../partials/Wallet.svelte';
	import { ALCHEMY_NODE_KEY_POLYGON_MAINNET, ALCHEMY_NODE_KEY_ETHEREUM_MAINNET, PROJECT_ID_WALLETCONNECT, VITE_PROJECT_ID} from '$lib/boilerplate/js/env.ts';
  	import type { env } from '$env/dynamic/private';
  import Transaction from '../../partials/Transaction.svelte';
  
	let _chainId;
  
	onMount(async () => {
	  _chainId = $chainId;
	  const provider = await EthereumProvider.init({
		projectId: VITE_PROJECT_ID,
		metadata: {
		  name: 'My Website',
		  description: 'My Website Description',
		  url: 'https://mywebsite.com',
		  icons: ['https://avatars.githubusercontent.com/u/37784886']
		},
		showQrModal: true,
		optionalChains: [1, 137, 2020],
		rpcMap: {
		  1: 'https://eth-mainnet.alchemyapi.io/v2/' + ALCHEMY_NODE_KEY_ETHEREUM_MAINNET,
		  137: 'https://polygon-mainnet.g.alchemy.com/v2/' + ALCHEMY_NODE_KEY_POLYGON_MAINNET,
		},
	  });
	});
  </script>
  
  {#if $account.address}
	<Card>
	  <span>
		<span id="title">Chain ID:</span>
		{$account.chain?.id}
	  </span>
	  <span>
		<span id="title">User address:</span>
		{$account.address}
	  </span>
	  {#if $account.chain}
		<span>
		  <span id="title">Network:</span>
		  {$account.chain?.name}
		</span>
		<span>
		  <span id="title">Decimals:</span>
		  {$account.chain?.nativeCurrency.decimals}
		</span>
		<span>
		  <span id="title">Currency:</span>
		  {$account.chain?.nativeCurrency.name}
		</span>
	  {/if}
	</Card>
  {/if}
  
  <Transaction/>
  <style>
	#title {
	  font-weight: 500;
	}
  </style>
  
  <w3m-button />