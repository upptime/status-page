<script>
  import Nav from "../components/Nav.svelte";
  import config from "../data/config.json";
  import snarkdown from "snarkdown";
  import { each } from "svelte/internal";
  export let segment;
</script>

<style>
  footer {
    text-align: center;
    opacity: 0.75;
    margin-top: 3rem;
  }
</style>

<svelte:head>
  <link
    rel="icon"
    type="image/svg"
    href={(config['status-website'] || {}).faviconSvg || (config['status-website'] || {}).favicon || `https://raw.githubusercontent.com/koj-co/upptime/master/assets/icon.svg`} />
  <link
    rel="icon"
    type="image/png"
    href={(config['status-website'] || {}).favicon || `/logo-192.png`} />
  {#if config['status-website'].scripts}
    {#each config['status-website'].scripts as script}
      <script src={script.src} async={!!script.async} defer={!!script.async}>
      </script>
    {/each}
  {/if}
  {#if config['status-website'].links}
    {#each config['status-website'].links as link}
      <link rel={link.rel} href={link.href} media={link.media} />
    {/each}
  {/if}
  {#if config['status-website'].css}
    <style>
{config['status-website'].css}
    </style>
  {/if}
</svelte:head>

<Nav {segment} />

<main class="container">
  <slot />
</main>

<footer>
  <p>
    {@html snarkdown(config.i18n.footer.replace(/\$REPO/, `https://github.com/${config.owner}/${config.repo}`))}
  </p>
</footer>
