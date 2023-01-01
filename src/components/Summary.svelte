<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import { handleError } from "../utils/createOctokit";

  export let slug;
  let loading = true;

  let { apiBaseUrl,userContentBaseUrl } = config["status-website"] || {};
  if (!apiBaseUrl) apiBaseUrl = "https://api.github.com";
  if (!userContentBaseUrl)  userContentBaseUrl = "https://raw.githubusercontent.com";

  const owner = config.owner;
  const repo = config.repo;
  let summary = null;

  onMount(async () => {
    try {
      const res = await fetch(`${userContentBaseUrl}/${owner}/${repo}/master/history/summary.json`);
      summary = (await res.json()).find((item) => item.slug === slug);
    } catch (error) {
      handleError(error);
    }
    loading = false;
  });
</script>

<style>
  .no-underline {
    text-decoration: none;
  }
</style>

<section>
  {#if loading}
    <Loading />
  {:else if summary}
    <h1>
      <a class="no-underline" href={summary.url.startsWith('$') ? '#' : summary.url}>{summary.name}</a>
      <span class={`tag ${summary.status}`}>
        {summary.status === 'up' ? config.i18n.up : config.i18n.down}
      </span>
    </h1>
    <dl>
      <dt>{config.i18n.overallUptimeTitle}</dt>
      <dd>{summary.uptime}</dd>
      {#if summary.showAverageResponseTime === undefined || summary.showAverageResponseTime}
        <dt>{config.i18n.averageResponseTimeTitle}</dt>
        <dd>{summary.time}{config.i18n.ms}</dd>
      {/if}
    </dl>
  {/if}
</section>
