<script>
  let introducingFAVVideoVisible = false;
  let favEarnVideoVisible = false;
  let favLoansVideoVisible = false;
  let referralsVideoVisible = false;
  let tokensinkVideoVisible = false;

  function playVideo(video) {
    introducingFAVVideoVisible = video === "introducingFAV";
    favEarnVideoVisible = video === "favEarn";
    favLoansVideoVisible = video === "favLoans";
    referralsVideoVisible = video === "referrals";
    tokensinkVideoVisible = video === "tokenSink";
  }
</script>

<div class="mx-auto max-w-[800px] space-y-8">
  
  <div class="font-BarlowRegular text-sm text-center leading-relaxed text-blackPrim-light dark:text-blackPrim-dark">
    <span class="text-base text-bluePrim-light">Welcome to the FAV testing site.</span> <br>
    The team has been in testing throughout 2024 and now we need the community to help us add another layer of testing so we can finalise ready for launch. <br>
    Given this is a test ONLY USE very small amounts of tokens for testing, we recommend less than $1. 
    Please note that this version of the site has time refactored for rapid testing.<br>
    Whereas the full product will offer 1-30 year loans, this version has replaced years with minutes.<br>
    This means a 30 year loan will be compressed into 30 mins!<br>
    You'll have full control of your loan management and this way you can test seeing your loan through to the end and finalising it.<br>
    Did we forget to mention, EARLY TESTERS WILL BE REWARDED WITH FAV TOKENS. To prevent gamification we can't stipulate the criteria for receiving FAV token rewards however we can say that using as many features of the site will only help.
  </div>

  <!-- Introducing FAV Video -->
  <div class="flex justify-center">
    {#if introducingFAVVideoVisible}
    <div class="relative pt-[56.25%] w-full">
      <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/t-zwRJQVqkk" title="Introducing FAV - Learn about FAV Loans and FAV Earn" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    {:else}
      <button on:click={() => playVideo('introducingFAV')} class="cursor-pointer">
        <img src="/youTubeThumbs/FAV Overview-100.jpg" alt="Play Introducing FAV Video" class="aspect-video object-cover" />
      </button>
    {/if}
  </div>

  <!-- Referrals Video -->
  <div class="flex justify-center">
    {#if referralsVideoVisible}
    <div class="relative pt-[56.25%] w-full">
      <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/whbH5fDqrpk" title="FAV Referrals" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>    
    </div>
    {:else}
      <button on:click={() => playVideo('referrals')} class="cursor-pointer">
        <img src="/youTubeThumbs/Referral programme-100.jpg" alt="Play Referrals Video" class="aspect-video object-cover" />
      </button>
    {/if}
  </div>

  <div class="flex justify-center">
    {#if favLoansVideoVisible}
    <div class="relative pt-[56.25%] w-full">
      <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/jy9jvUT5nj8" title="FAV Loans - Borrow more with less" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    {:else}
      <button on:click={() => playVideo('favLoans')} class="cursor-pointer">
        <img src="/youTubeThumbs/FAV Loans-100.jpg" alt="Play FAV Loans Video" class="aspect-video object-cover" />
      </button>
    {/if}
  </div>
  
  <div class="flex justify-center">
    {#if favEarnVideoVisible}
    <div class="relative pt-[56.25%] w-full">
      <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/fru8fAGvpho" title="FAV Earn - how to profit" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    {:else}
      <button on:click={() => playVideo('favEarn')} class="cursor-pointer">
        <img src="/youTubeThumbs/FAV Earn-100.jpg" alt="Play Referrals Video" class="aspect-video object-cover" />
      </button>
    {/if}
  </div>
  
  <div class="flex justify-center">
    {#if tokensinkVideoVisible}
    <div class="relative pt-[56.25%] w-full">
      <iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/whbH5fDqrpk" title="FAV Referrals" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    {:else}
      <button on:click={() => playVideo('tokenSink')} class="cursor-pointer">
        <img src="/youTubeThumbs/DAOs-100.jpg" alt="Play Token Sink Video" class="aspect-video object-cover" />
      </button>
    {/if}
  </div>
</div>