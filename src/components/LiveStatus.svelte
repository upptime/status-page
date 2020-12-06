<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import { createOctokit, handleError } from "../utils/createOctokit";

  let loading = true;
  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let { apiBaseUrl } = config["status-website"] || {};
  let sites = [];
  if (!apiBaseUrl) apiBaseUrl = "https://api.github.com";
  const userContentBaseUrl = apiBaseUrl.includes("api.github.com")
    ? `https://raw.githubusercontent.com`
    : apiBaseUrl;
  const graphsBaseUrl = `${userContentBaseUrl}/${owner}/${repo}/master/graphs`;

  let selected = "week";

  onMount(async () => {
    try {
      sites = JSON.parse(
        atob(
          (
            await octokit.repos.getContent({
              owner,
              repo,
              path: "history/summary.json",
            })
          ).data.content.replace(/\n/g, "")
        )
      );
    } catch (error) {
      handleError(error);
    }
    loading = false;
  });
</script>

<style>
  article {
    background-size: contain;
    background-position: top right;
    background-repeat: no-repeat;
  }
  .icon {
    height: 1rem;
    margin-right: 0.33rem;
    vertical-align: middle;
    transform: scale(1.1) translateY(-0.1rem);
  }
  a {
    text-decoration: none;
  }
  .r input:checked + label {
    font-weight: bold;
  }
  .r input {
    display: none;
  }
  .r label {
    margin-left: 1rem;
  }
</style>

<div class="f">
  <h2>{config.i18n.liveStatus}</h2>
  <form class="f r">
    <div>
      <input value="day" bind:group={selected} name="d" type="radio" id="data_day" /><label
        for="data_day">{config.i18n.duration24H || '24h'}</label>
    </div>
    <div>
      <input value="week" bind:group={selected} name="d" type="radio" id="data_week" /><label
        for="data_week">{config.i18n.duration7D || '7d'}</label>
    </div>
    <div>
      <input value="month" bind:group={selected} name="d" type="radio" id="data_month" /><label
        for="data_month">{config.i18n.duration30D || '30d'}</label>
    </div>
    <div>
      <input value="year" bind:group={selected} name="d" type="radio" id="data_year" /><label
        for="data_year">{config.i18n.duration1Y || '1y'}</label>
    </div>
    <div>
      <input value="all" bind:group={selected} name="d" type="radio" id="data_all" /><label
        for="data_all">{config.i18n.durationAll || 'all'}</label>
    </div>
  </form>
</div>
<section>
  {#if loading}
    <Loading />
  {:else if sites.length}
    {#each sites as site}
      <article
        class={`${site.status} link`}
        style={`background-image: url("${graphsBaseUrl}/${site.slug}/response-time${selected === 'day' ? '-day' : selected === 'week' ? '-week' : selected === 'month' ? '-month' : selected === 'year' ? '-year' : ''}.png`}>
        <h4>
          <img class="icon" alt="" src={site.icon} />
          <a href={`${config.path}/history/${site.slug}`}>{site.name}</a>
        </h4>
        <div>
          {@html config.i18n.overallUptime.replace(/\$UPTIME/g, selected === 'day' ? site.uptimeDay : selected === 'week' ? site.uptimeWeek : selected === 'month' ? site.uptimeMonth : selected === 'year' ? site.uptimeYear : site.uptime)}
        </div>
        <div>
          {@html config.i18n.averageResponseTime.replace(/\$TIME/g, selected === 'day' ? site.timeDay : selected === 'week' ? site.timeWeek : selected === 'month' ? site.timeMonth : selected === 'year' ? site.timeYear : site.time)}
        </div>
      </article>
    {/each}
  {/if}
</section>
