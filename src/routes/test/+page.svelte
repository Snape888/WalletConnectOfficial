<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';

	import { onMount } from 'svelte';

	import { ALCHEMY_NODE_KEY_POLYGON_MAINNET, ALCHEMY_NODE_KEY_ETHEREUM_MAINNET, PROJECT_ID_WALLETCONNECT, VITE_PROJECT_ID} from '$lib/boilerplate/js/env.ts';
  	import type { env } from '$env/dynamic/private';
  import Transaction from '../../partials/Transaction.svelte';
  
	let _chainId;
  
	onMount(async () => {
	  _chainId = $chainId;
	  
	});

	async function sendtoSheets() {
	const message = "hello mars";
	const url = "https://script.google.com/macros/s/AKfycbywjaoiZJTKZ4QOauSvBXN_K2mIGjDG3VWk-vhBXt84Pm2OnPmO_aXoC2s6hU9nZYY/exec"; 
	
	try {
		const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `message=${encodeURIComponent(message)}`,
		});
		
		if (response.ok) {
		const data = await response.text();
		console.log("Response from Sheets:", data);
		} else {
		console.error("Error sending data to Sheets:", response.status);
		}
	} catch (error) {
		console.error("Error:", error);
	}
	}
	
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
  
  <button on:click={sendtoSheets}>click</button>