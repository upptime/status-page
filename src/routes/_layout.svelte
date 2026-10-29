<script>
  import Nav from "../components/Nav.svelte";
  import config from "../data/config.json";
  import snarkdown from "snarkdown";
  export let segment;

  const statusWebsite = config["status-website"] || {};
  const faviconBaseUrl = (statusWebsite.baseUrl || "").replace(/\/$/, "");
  const defaultPngFavicon = `${faviconBaseUrl}/logo-192.png`;
</script>

<svelte:head>
  {#if (config["status-website"] || {}).customHeadHtml}
    {@html (config["status-website"] || {}).customHeadHtml}
  {/if}
  {#if (config["status-website"] || {}).themeUrl}
    <link rel="stylesheet" href={(config["status-website"] || {}).themeUrl} />
  {:else if (config["status-website"] || {}).theme}
    <link
      rel="stylesheet"
      href={`${config.path}/themes/${config["status-website"].theme}.css`}
    />
  {:else}
    <link
      rel="stylesheet"
      href={`${config.path}/themes/light.css`}
      media="(prefers-color-scheme: light)"
    />
    <link
      rel="stylesheet"
      href={`${config.path}/themes/dark.css`}
      media="(prefers-color-scheme: dark)"
    />
    <!-- https://caniuse.com/prefers-color-scheme -->
    <!-- https://web.dev/prefers-color-scheme/ -->
    <script>
      // If `prefers-color-scheme` is not supported, fall back to light mode.
      // In this case, light.css will be downloaded with `highest` priority.
      // Svelte does not fill in expressions inside this script, so the URL is
      // taken from the light theme link above.
      if (typeof window !== "undefined" && typeof document !== "undefined" && "matchMedia" in window && window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
        var lightTheme = document.querySelector('link[media="(prefers-color-scheme: light)"]');
        if (lightTheme) {
          document.documentElement.style.display = 'none';
          var fallback = document.createElement('link');
          fallback.rel = 'stylesheet';
          fallback.href = lightTheme.href;
          fallback.onload = fallback.onerror = function () { document.documentElement.style.display = ''; };
          document.head.appendChild(fallback);
        }
      }
    </script>
  {/if}
  <link rel="stylesheet" href={`${config.path}/global.css`} />
  <link
    rel="icon"
    type="image/svg"
    href={(config["status-website"] || {}).faviconSvg ||
      (config["status-website"] || {}).favicon ||
      `https://raw.githubusercontent.com/upptime/upptime/master/assets/upptime-icon.svg`}
  />
  <link
    rel="icon"
    type="image/png"
    href={(config["status-website"] || {}).favicon || defaultPngFavicon}
  />
  {#if (config["status-website"] || {}).scripts}
    {#each (config["status-website"] || {}).scripts as script}<script
        src={script.src}
        async={!!script.async}
        defer={!!script.async}>
      </script>{/each}
  {/if}
  {#if (config["status-website"] || {}).links}
    {#each (config["status-website"] || {}).links as link}
      <link rel={link.rel} href={link.href} media={link.media} />
    {/each}
  {/if}
  {#if (config["status-website"] || {}).metaTags}
    {#each (config["status-website"] || {}).metaTags as link}
      <meta name={link.name} content={link.content} />
    {/each}
  {/if}
  {#if config['status-website'].css}
    {@html `<style>${config['status-website'].css}</style>`}
  {/if}
  {#if config['status-website'].js}
    {@html `<script>${config['status-website'].js}</script>`}
  {/if}
</svelte:head>

{#if (config["status-website"] || {}).customBodyHtml}
  {@html (config["status-website"] || {}).customBodyHtml}
{/if}

<Nav {segment} />

<main class="container">
  <slot />
</main>

<footer>
  <p>
    {@html snarkdown(
      config.i18n.footer.replace(/\$REPO/, `https://github.com/${config.owner}/${config.repo}`)
    )}
  </p>
</footer>

<style>
  footer {
    text-align: center;
    opacity: 0.75;
    margin-top: 3rem;
  }
</style>

{#if (config["status-website"] || {}).customFootHtml}
  {@html (config["status-website"] || {}).customFootHtml}
{/if}