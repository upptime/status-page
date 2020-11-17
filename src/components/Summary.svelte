<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import { createOctokit, handleError } from "../utils/createOctokit";

  export let slug;
  let loading = true;
  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let summary = null;

  onMount(async () => {
    try {
      summary = JSON.parse(
        atob(
          (
            await octokit.repos.getContent({
              owner,
              repo,
              path: "history/summary.json",
            })
          ).data.content
        )
      ).find((item) => item.slug === slug);
    } catch (error) {
      handleError(error);
    }
    loading = false;
  });
</script>

<style>
</style>

<section>
  {#if loading}
    <Loading />
  {:else if summary}
    <h1>
      {summary.name}
      <span class={`tag ${summary.status}`}>
        {summary.status === 'up' ? config.i18n.up : config.i18n.down}
      </span>
    </h1>
    <dl>
      <dt>{config.i18n.overallUptimeTitle}</dt>
      <dd>{summary.uptime}%</dd>
      <dt>{config.i18n.averageResponseTimeTitle}</dt>
      <dd>{summary.time}{config.i18n.ms}</dd>
    </dl>
  {/if}
</section>
