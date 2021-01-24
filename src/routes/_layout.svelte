<script>
  import Nav from "../components/Nav.svelte";
  import config from "../data/config.json";
  import snarkdown from "snarkdown";
  export let segment;
</script>

<svelte:head>
  {#if config["status-website"].customHeadHtml}
    {@html config["status-website"].customHeadHtml}
  {/if}
  <link
    rel="stylesheet"
    href={`${config.path}/themes/${(config["status-website"] || {}).theme || "light"}.css`}
  />
  <link rel="stylesheet" href={`${config.path}/global.css`} />
  <link
    rel="icon"
    type="image/svg"
    href={(config["status-website"] || {}).faviconSvg ||
      (config["status-website"] || {}).favicon ||
      `https://raw.githubusercontent.com/koj-co/upptime/master/assets/icon.svg`}
  />
  <link
    rel="icon"
    type="image/png"
    href={(config["status-website"] || {}).favicon || `/logo-192.png`}
  />
  {#if config["status-website"].scripts}
    {#each config["status-website"].scripts as script}<script
        src={script.src}
        async={!!script.async}
        defer={!!script.async}>
      </script>{/each}
  {/if}
  {#if config["status-website"].links}
    {#each config["status-website"].links as link}
      <link rel={link.rel} href={link.href} media={link.media} />
    {/each}
  {/if}
  {#if config["status-website"].metaTags}
    {#each config["status-website"].metaTags as link}
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

{#if config["status-website"].customBodyHtml}
  {@html config["status-website"].customBodyHtml}
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
