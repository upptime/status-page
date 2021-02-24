<script>
  import snarkdown from "snarkdown";
  import ActiveIncidents from "../components/ActiveIncidents.svelte";
  import ActiveScheduled from "../components/ActiveScheduled.svelte";
  import Incidents from "../components/Incidents.svelte";
  import LiveStatus from "../components/LiveStatus.svelte";
  import Scheduled from "../components/Scheduled.svelte";
  import config from "../data/config.json";

  let title = "Status";
  try {
    title = config["status-website"].name;
  } catch (error) {}
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header>
  {#if config["status-website"]}
    {#if config["status-website"].introTitle}
      <h1>
        {@html snarkdown(config["status-website"].introTitle)}
      </h1>
    {/if}
    {#if config["status-website"].introMessage}
      <p class="lead">
        {@html snarkdown(config["status-website"].introMessage)}
      </p>
    {/if}
  {/if}
</header>

<ActiveIncidents />
<ActiveScheduled />
<LiveStatus />
<Scheduled />
<Incidents />

<style>
  p.lead {
    font-size: 110%;
  }
  header {
    margin-bottom: 2rem;
  }
</style>
