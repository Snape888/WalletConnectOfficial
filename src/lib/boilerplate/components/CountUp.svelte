<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { isNumber } from './utils'; // Assume this utility function validates the number
  
    export let number;
    export let time = 1000; // default time of 1 second
    export let decimals = 5; // default decimals
  
    if (!isNumber(number)) {
      console.error('Provided value is not a valid number');
      number = 0;
    }
  
    const animatedNumber = tweened(0, {
      duration: time,
      easing: cubicOut
    });
  
    $: animatedNumber.set(parseFloat(number));
  </script>
  
  <span>
    {$animatedNumber.toFixed(decimals)}
  </span>
  

  