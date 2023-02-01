<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import { createOctokit, handleError } from "../utils/createOctokit";

  let loading = true;
  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let sites = [];

  let { apiBaseUrl, userContentBaseUrl } = config["status-website"] || {};
  if (!apiBaseUrl) apiBaseUrl = "https://api.github.com";
  if (!userContentBaseUrl) userContentBaseUrl = "https://raw.githubusercontent.com";

  const graphsBaseUrl = `${userContentBaseUrl}/${owner}/${repo}/master/graphs`;
  let form = null;

  let selected = "week";

  onMount(async () => {
    try {
      const res = await fetch(`${userContentBaseUrl}/${owner}/${repo}/master/history/summary.json`);
      sites = await res.json();
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
        id="data_day"
      /><label for="data_day">{config.i18n.duration24H}</label>
    </div>
    <div>
      <input
        value="week"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_week"
      /><label for="data_week">{config.i18n.duration7D}</label>
    </div>
    <div>
      <input
        value="month"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_month"
      /><label for="data_month">{config.i18n.duration30D}</label>
    </div>
    <div>
      <input
        value="year"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_year"
      /><label for="data_year">{config.i18n.duration1Y}</label>
    </div>
    <div>
      <input
        value="all"
        bind:group={selected}
        name="d"
        type="radio"
        on:change={changed}
        id="data_all"
      /><label for="data_all">{config.i18n.durationAll}</label>
    </div>
  </form>
</div>
<section class="live-status">
  {#if loading}
    <Loading />
  {:else if sites.length}
    {#each sites as site}
      <article
        class={`${site.status} link graph`}
        style="--background: url('{`${graphsBaseUrl}/${site.slug}/response-time${
          selected === "day"
            ? "-day"
            : selected === "week"
            ? "-week"
            : selected === "month"
            ? "-month"
            : selected === "year"
            ? "-year"
            : ""
        }.png`}')"
        ><h4>
          <img class="icon" alt="" src={site.icon} />
          <a href={`${config.path}/history/${site.slug}`}>{site.name}</a>
        </h4>
        <div>
          {@html config.i18n.overallUptime.split("$UPTIME")[0]}
          <span class="data"
            >{selected === "day"
              ? site.uptimeDay
              : selected === "week"
              ? site.uptimeWeek
              : selected === "month"
              ? site.uptimeMonth
              : selected === "year"
              ? site.uptimeYear
              : site.uptime}
            {@html config.i18n.overallUptime.split("$UPTIME")[1]}</span
          >
        </div>
        {#if site.showAverageResponseTime === undefined || site.showAverageResponseTime}
          <div>
            {@html config.i18n.averageResponseTime.split("$TIME")[0]}
            <span class="data"
              >{selected === "day"
                ? site.timeDay
                : selected === "week"
                ? site.timeWeek
                : selected === "month"
                ? site.timeMonth
                : selected === "year"
                ? site.timeYear
                : site.time}
              {@html config.i18n.averageResponseTime.split("$TIME")[1]}</span
            >
          </div>
        {/if}
      </article>
    {/each}
  {/if}
</section>

<style>
  article.graph {
    background-image: var(--background);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center right;
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
</style>
