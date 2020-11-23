<script>
  import config from "../data/config.json";
</script>

<style>
  p.lead {
    font-size: 110%;
  }
  a.button {
    font: inherit;
    padding: 0.5rem 1rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.25);
    border-radius: 0.2rem;
    background-color: #01a3a4;
    text-decoration: none;
    color: #fff;
    border-color: transparent;
  }
</style>

<svelte:head>
  <title>{config.i18n.errorTitle}</title>
</svelte:head>

<h1>{config.i18n.errorTitle}</h1>

<p class="lead">{config.i18n.errorIntro}</p>

<p>{config.i18n.errorText}</p>

<a href={config.path} class="button">{config.i18n.errorHome}</a>
