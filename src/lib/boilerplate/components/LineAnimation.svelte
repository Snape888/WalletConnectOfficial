<script>
  import { tweened } from 'svelte/motion';
  import { cubicInOut, cubicOut, linear } from 'svelte/easing';
  import { onMount, createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';

  export let message = ''; // Customizable message
  const dispatch = createEventDispatcher();

  const progress = tweened(0, {
    duration: 2000,
    easing: cubicInOut,
  });

  // Continuous loop function
  function loopAnimation() {
    progress.set(105, { duration: 3500 }).then(() => {
      progress.set(0, { duration: 0 }); // Instantly reset without animation
      loopAnimation(); // Recursively call to continue the loop
    });
  }

  onMount(() => {
    loopAnimation(); // Start the looping animation
  });

  function handleClose() {
    dispatch('close');
  }
</script>

<style>

</style>

<div in:scale={{ duration: 400 }} out:scale={{ duration: 400 }} class="bg-whitePrim-light rounded-lg overflow-hidden p-2 relative flex justify-center items-center mb-4">
  <!-- Moving line container -->
  <div class="absolute inset-0 flex justify-center items-center">
    <div class="moving-line w-2 h-full bg-bluePrim-light absolute" style="left: calc(-20px + { $progress }%);"></div>
  </div>
  
  <!-- Text and close button container -->
  <div class="z-10 flex justify-between items-center w-full px-2">
    {#if message}
      <div class="text-base bg-whitePrim-light p-1 font-BarlowSemiBold text-center flex-1">{message}</div>
    {/if}
    <button class="py-1 px-2 h-6 rounded-md ml-1 bg-orangePrim-light font-BarlowBold text-xs text-whitePrim-light" on:click={handleClose}>✕</button>
  </div>
</div>
