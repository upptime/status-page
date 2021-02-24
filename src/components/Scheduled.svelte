<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import { cachedResponse, createOctokit, handleError } from "../utils/createOctokit";

  let loading = true;
  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let incidents = [];

  onMount(async () => {
    try {
      incidents = (
        await cachedResponse(`maintenance-issues-${owner}-${repo}`, () =>
          octokit.issues.listForRepo({
            owner,
            repo,
            state: "closed",
            filter: "all",
            sort: "created",
            direction: "desc",
            labels: "maintenance",
          })
        )
      ).data;
    } catch (error) {
      handleError(error);
    }
    incidents = incidents.map((incident, index) => {
      incident.showHeading =
        index === 0 ||
        new Date(incidents[index - 1].created_at).toLocaleDateString() !==
          new Date(incident.created_at).toLocaleDateString();
      return incident;
    });
    loading = false;
  });
</script>

<section>
  {#if loading}
    <Loading />
  {:else if incidents.length}
    <h2>{config.i18n.pastScheduledMaintenance}</h2>
    {#each incidents as incident}
      {#if incident.showHeading}
        <h3>{new Date(incident.created_at).toLocaleDateString()}</h3>
      {/if}
      <article class="link degraded">
        <div class="f">
          <div>
            <h4>{incident.title.replace("🛑", "").replace("⚠️", "").trim()}</h4>
            <div>Completed</div>
          </div>
          <div class="f r">
            <a href={`${config.path}/incident/${incident.number}`}>
              {config.i18n.incidentReport.replace(/\$NUMBER/g, incident.number)}
            </a>
          </div>
        </div>
      </article>
    {/each}
  {/if}
</section>

<style>
  h2 {
    margin-top: 2rem;
  }
</style>
