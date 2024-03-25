<script lang="ts">
	import { chainId, account } from '$lib/web3modal';
	import Card from '../../components/Card.svelte';
    import Transaction from '../../partials/Transaction.svelte';
	import SignMessage from '$lib/boilerplate/components/RespondToSignedMessage.svelte';
	import {user} from '$lib/project/js/stores/projectDynamicValues';
	import { GAS_URL, sheetId, apiKey, range } from "$lib/boilerplate/js/env.ts";
  
	let inputsDisabled = true;
	const webAppUrl = GAS_URL;

	let isEligible = false;
  let existingEntry;
  let twitterLink = '';
  let isValidLink = true;
  let alias = '';
  let isValidAlias = true;
  let description = '';
  let isValidDescription = false;
  let twitterHandle = '';
  let isValidTwitterHandle = true;
  let email = '';
  let isValidEmail = true;
  let includeFavAirdrop = false;

  async function searchAddressInSheet(address) {
    const _sheetId = sheetId;
    const _apiKey = apiKey;
    const _range = range;


    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${_sheetId}/values/${_range}?key=${_apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      const values = data.values || [];
      return values.some(row => row[0] === address);
    } else {
      console.error('Error searching address in sheet:', response.status);
      return false;
    }
  }

  async function checkEligibility() {
  try {
    isEligible = await searchAddressInSheet($user);
    if (isEligible) {
      alert('Congratulations! You are eligible for the Cat-in-a-Box airdrop.');
      inputsDisabled = false;
    } else {
      alert('Sorry, you are not currently eligible for the Cat-in-a-Box airdrop. However, you can still sign up for the FAV airdrop to earn points and be eligible for the airdrop when FAV launches.');
      inputsDisabled = true;
    }
  } catch (error) {
    console.error('Error checking eligibility:', error);
    alert('An error occurred while checking eligibility. Please try again later.');
  }
}


  function isValidTwitterLink(link: string): boolean {
    const twitterRegex = /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\?.*)?$/;
    if (!twitterRegex.test(link)) {
      return false;
    }

    const statusId = twitterRegex.exec(link)?.[2];
    if (!statusId) {
      return false;
    }

    return true;
  }

  function validateLink() {
    isValidLink = isValidTwitterLink(twitterLink);
  }

  function isValidAliasFormat(alias: string): boolean {
    return alias.length >= 3 && alias.length <= 50;
  }

  function validateAlias() {
    isValidAlias = isValidAliasFormat(alias);
  }

  function isValidDescriptionFormat(description: string): boolean {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 25 && wordCount <= 200;
  }

  function validateDescription() {
    isValidDescription = isValidDescriptionFormat(description);
  }

  function isValidTwitterHandleFormat(handle: string): boolean {
    const twitterHandleRegex = /^@?(\w){1,15}$/;
    return twitterHandleRegex.test(handle);
  }

  function validateTwitterHandle() {
    isValidTwitterHandle = isValidTwitterHandleFormat(twitterHandle);
  }

  function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateEmail() {
    isValidEmail = isValidEmailFormat(email);
  }



  async function sendAddressToAppsScript(address) {
    try {
      if (!isEligible) {
        // ... (code to disable input boxes and show message)
        return;
      }

      const addressExists = await searchAddressInSheet(address);

      if (!addressExists) {
        // ... (code to disable input boxes and show message)
        return;
      }

      // Send form data to the Google Apps Script using a POST request
      const response = await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          twitterLink: twitterLink,
          alias: alias,
          description: description,
          twitterHandle: twitterHandle,
          email: email,
          includeFavAirdrop: includeFavAirdrop,
          additionalData: 'Some additional data',
        }),
      });

      console.log('Request sent. Check the Google Sheet for update.');
      console.log('Twitter link:', twitterLink);
      console.log('Alias:', alias);
      console.log('Description:', description);
      console.log('Twitter handle:', twitterHandle);
      console.log('Email:', email);
      console.log('Include in FAV airdrop:', includeFavAirdrop);
    } catch (error) {
      console.error('Error:', error);
    }
  }

$: {
  if ($user) {
    inputsDisabled = true;
    isEligible = false;
    twitterLink = '';
    alias = '';
    description = '';
    twitterHandle = '';
    email = '';
    includeFavAirdrop = false;
  }
}
  </script>
  


  <SignMessage on:signed={() => sendAddressToAppsScript($user)}>
	<div class="relative">
		<div class="flex justify-end">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" on:click="{checkEligibility}">
			  Check eligibility
			</button>
		  </div>
		<label for="alias" class="block text-sm font-medium text-gray-700"><span class="font-MyriadProSemibold">100pts</span> - What's your alias Cat name?:</label>
		<input type="text" id="alias" bind:value="{alias}" on:input="{validateAlias}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		{#if !isValidAlias}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">X</span>
		{:else}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
		{/if}

		<label for="twitter-handle" class="block text-sm font-medium text-gray-700"><span class="font-MyriadProSemibold">100pts</span> - Twitter Handle:</label>
		<input type="text" id="twitter-handle" bind:value="{twitterHandle}" on:input="{validateTwitterHandle}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm " disabled="{inputsDisabled}"/>
		{#if !isValidTwitterHandle}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">X</span>
		{:else}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
		{/if}

		<label for="twitter-link" class="block text-sm font-medium text-gray-700"><span class="font-MyriadProSemibold">100pts</span> - T witter Link:</label>
		<input type="text" id="twitter-link" bind:value="{twitterLink}" on:input="{validateLink}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled="{inputsDisabled}"/>
		{#if !isValidLink}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">X</span>
		{:else}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
		{/if}
	
		
	
		<label for="description" class="block text-sm font-medium text-gray-700"><span class="font-MyriadProSemibold">100pts</span> - Tell us why Cat-in-a-Box is awesome in over 25 words:</label>
		<textarea id="description" bind:value="{description}" on:input="{validateDescription}" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled="{inputsDisabled}"></textarea>
		{#if !isValidDescription}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">X</span>
		{:else}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
		{/if}
	
		
	
		<label for="email" class="block text-sm font-medium text-gray-700">Sign up for DeFiGarage and Cat-in-a-Box airdrop notifications:</label>
		<input type="email" id="email" bind:value="{email}" on:input="{validateEmail}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
		{#if !isValidEmail}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">X</span>
		{:else}
		  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
		{/if}
	
		<label class="inline-flex items-center mt-3">
		  <input type="checkbox" bind:checked="{includeFavAirdrop}" class="form-checkbox h-5 w-5 text-indigo-600" />
		  <span class="ml-2 text-gray-700 text-sm">I would like to be included in the FAV airdrop from DefiGarage</span>
		</label>
	  </div>
</SignMessage>

  
  
  <style>
	#title {
	  font-weight: 500;
	}
  </style>
  


