<script lang="ts">
	import { account } from '$lib/web3modal'
	import { Toaster } from 'svelte-french-toast'
	import Network from '../../partials/Network.svelte'
	import SignMessage from '../../partials/SignMessage.svelte'
	import SignTypeData from '../../partials/SignTypeData.svelte'
	import Transaction from '../../partials/Transaction.svelte'
	import Wallet from '../../partials/Wallet.svelte'
	import CustomForm from '../../partials/CustomForm.svelte'
</script>

<div class="main">
	<Network />
	<Wallet />
	{#if $account.isConnected}
		<SignMessage />
		<SignTypeData />
		<Transaction />
	{:else}
		<CustomForm/>
	{/if}
</div>

<Toaster />

<style lang="postcss">
	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 30px;
		width: 100%;
		padding: 20px;
	}
</style>
