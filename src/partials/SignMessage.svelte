<script lang="ts">
	import { signMessage } from '@wagmi/core';
	import toast from 'svelte-french-toast';
	import Card from '../components/Card.svelte';
	import Button from '../components/Button.svelte';
	import { wagmiConfig } from '$lib/web3modal';
	import { user } from '$lib/project/js/stores/projectDynamicValues';
	import { createEventDispatcher } from 'svelte';
  
	let signature: string | undefined;
	let label: string = 'Sign Message';
	const dispatch = createEventDispatcher();
  
	async function handleSign() {
	  label = 'Signing...';
	  signature = '_';
  
	  try {
		const _signature = await signMessage(wagmiConfig, {
		  message: 'WalletConnect message',
		});
  
		if (_signature) {
		  signature = _signature;
		  toast.success('Message signed successfully');
		  dispatch('signed', $user); // Correctly dispatch the 'signed' event with the user's address
		} else {
		  toast.error('The signature was rejected');
		  signature = '_ personal_sign';
		}
	  } catch (error) {
		toast.error((error as Error).message);
	  } finally {
		label = 'Sign Message';
	  }
	}
  </script>

<Card>
	<div>
		{signature ?? '_ personal_sign'}
		<Button on:click={handleSign}>{label}</Button>
	</div>
</Card>

<style>
	div {
		width: 220px;
		word-wrap: break-word;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
</style>
