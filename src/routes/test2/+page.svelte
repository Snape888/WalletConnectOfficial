<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';
    import Transaction from '../../partials/Transaction.svelte';
	import SignMessage from '../../partials/SignMessage.svelte';
	import {user} from '$lib/project/js/stores/projectDynamicValues';
  
	const webAppUrl = "https://script.google.com/macros/s/AKfycbwaAOMnhjdQTG_F2yC2dvfQQzfm2CjExnF6oaqeY4Xs2wv-wHyNzpQHhD6Rr5fh0QUU/exec";
  
    async function sendAddressToAppsScript(address) {
        try {
            // Use 'no-cors' mode as it works for your setup.
            await fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: address,
                    additionalData: 'Some additional data',
                }),
            });

            console.log("Request sent. Check the Google Sheet for update.");
        } catch (error) {
            console.error('Error:', error);
        }
    }

	


	async function fetchSheetData() {
		const sheetId = '1Pwe53dmrtsCqC-ma0qcvDouPXl4eH8zEBvtxOh2fmO0';
		const apiKey = 'AIzaSyBolNVZkeUF95JJuN8IsC3rCoH7Cj86lvE';
		const range = 'claimOutputs!A1:D6'; // Adjust the range as needed

		const response = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
		);

		if (response.ok) {
		const data = await response.json();
		console.log(data.values);
		// Process the sheet data as needed
		} else {
		console.error('Error retrieving sheet data:', response.status);
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
  <SignMessage on:signed={() => sendAddressToAppsScript($user)}/>
  <style>
	#title {
	  font-weight: 500;
	}
  </style>
  
<button on:click={fetchSheetData}>Get sheet data</button>