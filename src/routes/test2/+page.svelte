<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';
    import Transaction from '../../partials/Transaction.svelte';
	import SignMessage from '../../partials/SignMessage.svelte';
	import {user} from '$lib/project/js/stores/projectDynamicValues';
  
	const webAppUrl = "https://script.google.com/macros/s/AKfycbyk3iSznj1joJKgZszz-i0iGphNvKlJHwhB13hv2h8HIG4vUnC7wEH3YBqB1wSd7zga7w/exec";
  
	async function sendAddressToAppsScript(address) {
	const response = await fetch(webAppUrl, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		address: $user,
		additionalData: 'Some additional data', // Optional, include if needed
		}),
		mode: 'no-cors', // Add this line to disable CORS
	});

	// Note: With 'no-cors' mode, you won't be able to access the response data
	console.log('Request sent');
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
  <SignMessage on:signed={() => sendAddressToAppsScript($user)}/>
  <style>
	#title {
	  font-weight: 500;
	}
  </style>
  
  <w3m-button />