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
  let form = null;

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
    if (form) form.classList.remove("changed");
  });

  const changed = () => {
    if (form) {
      form.classList.add("changed");
      setTimeout(() => form.classList.remove("changed"), 500);
    }
  };
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
  .data {
    transition: 0.3s;
  }
  .changed + section {
    background-color: transparent;
  }
  .data {
    padding: 0.15rem 0.25rem;
    border-radius: 0.2rem;
  }
  .changed + section .data {
    background-color: #fdcb6e;
  }
</style>

<div class="f changed" bind:this={form}>
  <h2>{config.i18n.liveStatus}</h2>
  <form class="f r">
    <div>
      <input
        value="day"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_day" /><label for="data_day">{config.i18n.duration24H || '24h'}</label>
    </div>
    <div>
      <input
        value="week"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_week" /><label for="data_week">{config.i18n.duration7D || '7d'}</label>
    </div>
    <div>
      <input
        value="month"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_month" /><label for="data_month">{config.i18n.duration30D || '30d'}</label>
    </div>
    <div>
      <input
        value="year"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_year" /><label for="data_year">{config.i18n.duration1Y || '1y'}</label>
    </div>
    <div>
      <input
        value="all"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_all" /><label for="data_all">{config.i18n.durationAll || 'all'}</label>
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
          {@html config.i18n.overallUptime.split('$UPTIME')[0]}
          <span
            class="data">{selected === 'day' ? site.uptimeDay : selected === 'week' ? site.uptimeWeek : selected === 'month' ? site.uptimeMonth : selected === 'year' ? site.uptimeYear : site.uptime}
            {@html config.i18n.overallUptime.split('$UPTIME')[1]}</span>
        </div>
        <div>
          {@html config.i18n.averageResponseTime.split('$TIME')[0]}
          <span
            class="data">{selected === 'day' ? site.timeDay : selected === 'week' ? site.timeWeek : selected === 'month' ? site.timeMonth : selected === 'year' ? site.timeYear : site.time}
            {@html config.i18n.averageResponseTime.split('$TIME')[1]}</span>
        </div>
      </article>
    {/each}
  {/if}
</section>
