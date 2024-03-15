<script>
    import { onMount } from 'svelte';

    export let content = `
      <h1 id="section1">Section 1</h1>
      <p>Some content for section 1...</p>
      <h2 id="section2">Section 2</h2>
      <p>Some content for section 2...</p>
    `;

    let headings = [];
    let contentContainer;

    function cleanText(text) {
        // Remove markup patterns like [d], [1], etc. from text
        return text.replace(/\[\w+\]/g, '');
    }

    onMount(async () => {
        const response = await fetch('/Documentation/FAV_Documentation.html');
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
        
            // Apply Tailwind font and text classes to headings and body text
            content = styleContentWithTailwind(doc.body.innerHTML);

            // Extract and clean headings for the sidebar
            const tempHeadings = [];
            doc.querySelectorAll('h2, h3').forEach(el => {
                if (el.id) {
                    const cleanedText = cleanText(el.textContent || el.innerText);
                    tempHeadings.push({ id: el.id, text: cleanedText });
                }
            });
            headings = tempHeadings;
        } else {
            console.log("Document content not found");
        }
    });


    function styleContentWithTailwind(htmlContent) {
      htmlContent = htmlContent
          .replace(/<h1/g, '<h1 class="text-lg font-BarlowBold pb-4 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<h2/g, '<h2 class="text-base font-BarlowSemiBold pb-3 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<h3/g, '<h3 class="text-md font-BarlowRegular pb-2 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<h4/g, '<h4 class="text-md font-BarlowLight pb-2 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<h5/g, '<h5 class="text-base font-BarlowLight pb-2 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<h6/g, '<h6 class="text-base font-BarlowLight pb-2 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<p/g, '<p class="text-base font-BarlowLight pb-2 text-blackPrim-light dark:text-blackPrim-dark"')
          .replace(/<li/g, '<li class="text-sm p-4 m-2 border font-BarlowLight pb-2 text-blackPrim-light dark:text-blackPrim-dark"');

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      doc.querySelectorAll('img').forEach(img => {
          // Remove the style attribute to eliminate sizing info
          img.removeAttribute('style');

          // Update the source if necessary and ensure the image stretches full width
          const originalSrc = img.getAttribute('src');
          if (originalSrc && !originalSrc.startsWith('/Documentation/Images/')) {
              const imageName = originalSrc.split('/').pop(); // Extract image name
              img.setAttribute('src', `/Documentation/Images/${imageName}`);
          }
          img.setAttribute('class', 'w-full max-w-full h-auto'); // Make images responsive
      });

      // Process other elements to remove inline styles that may conflict with Tailwind
      doc.querySelectorAll('[style]').forEach(el => {
          el.removeAttribute('style');
      });

      return doc.body.innerHTML; // Return the updated HTML
  }



</script>

<div class="flex flex-row min-h-screen">
  <aside class="w-64 h-screen fixed overflow-y-auto dark:bg-whitePrim-dark bg-whitePrim-light">
    <ul class="space-y-2 p-5">
      {#each headings as { id, text }}
        <li><a href={`#${id}`} class="text-bluePrim-light hover:text-orangePrim-light font-BarlowSemiBold">{text}</a></li>
      {/each}
    </ul>
  </aside>

  <div class="pl-64">
    <main class="overflow-y-auto p-5">
      {@html content}
    </main>
  </div>
</div>