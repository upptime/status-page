<script>
  import config from "../data/config.json";
</script>

<svelte:head>
  <title>{config.i18n.errorTitle}</title>
</svelte:head>

<h1>{config.i18n.errorTitle}</h1>

<p class="lead">{config.i18n.errorIntro}</p>

<p>{config.i18n.errorText}</p>

<a href={config.path} class="error-button">{config.i18n.errorHome}</a>

<style>
  p.lead {
    font-size: 110%;
  }
  a.error-button {
    font: inherit;
    padding: 0.5rem 1rem;
    border-radius: 0.2rem;
    text-decoration: none;
  }
</style>
