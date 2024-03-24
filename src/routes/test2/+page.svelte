<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';
    import Transaction from '../../partials/Transaction.svelte';
	import SignMessage from '../../partials/SignMessage.svelte';
	import {user} from '$lib/project/js/stores/projectDynamicValues';
  
	const webAppUrl = "https://script.google.com/macros/s/AKfycbzeFEzs2UAwLjP2cycI94BkCK4KJ8SHvmfCP6zbRhNubHJD9HQNjg3MKTbSXOKKs6kADg/exec";
  
	async function sendAddressToAppsScript(address) {
		try {
			const response = await fetch(webAppUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				address: $user,
				additionalData: 'Some additional data',
			}),
			credentials: 'include' // Include cookies
			});

			const data = await response.json();

			if (data.result === 'success') {
			console.log(data.message);
			// Display the success message to the user or perform any other actions
			console.log("your address has been submitted");
			} else {
			console.error(data.message);
			// Handle the error scenario
			}
		} catch (error) {
			console.error('Error:', error);
			// Handle any errors that occurred during the request
		}

		// Note: With 'no-cors' mode, you won't be able to access the response data
		
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