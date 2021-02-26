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
        await cachedResponse(`scheduled-current-${owner}-${repo}`, () =>
          octokit.issues.listForRepo({
            owner,
            repo,
            state: "open",
            filter: "all",
            sort: "created",
            direction: "desc",
            labels: "maintenance",
          })
        )
      ).data;
      incidents = incidents.map((incident, index) => {
        incident.showHeading =
          index === 0 ||
          new Date(incidents[index - 1].created_at).toLocaleDateString() !==
            new Date(incident.created_at).toLocaleDateString();
        incident.metadata = {};
        if (incident.body.includes("<!--")) {
          const summary = incident.body.split("<!--")[1].split("-->")[0];
          const lines = summary
            .split("\n")
            .filter((i) => i.trim())
            .filter((i) => i.includes(":"));
          lines.forEach((i) => {
            incident.metadata[i.split(/:(.+)/)[0].trim()] = i.split(/:(.+)/)[1].trim();
          });
        }
        return incident;
      });
    } catch (error) {
      handleError(error);
    }
    loading = false;
  });
</script>

<section>
  {#if loading}
    <Loading />
  {:else if incidents.length}
    <h2>{config.i18n.scheduledMaintenance}</h2>
    {#each incidents as incident}
      <article class="degraded degraded-active link">
        <div class="f">
          <div>
            <h4>{incident.title.replace("🛑", "").replace("⚠️", "").trim()}</h4>
            {#if incident.metadata.start && incident.metadata.end}
              <div>
                {(new Date(incident.metadata.start).getTime() < new Date().getTime()
                  ? config.i18n.scheduledMaintenanceSummaryStarted
                  : config.i18n.scheduledMaintenanceSummaryStarts
                )
                  .replace(/\$DATE/g, new Date(incident.metadata.start).toLocaleString())
                  .replace(
                    /\$DURATION/g,
                    Math.floor(
                      (new Date(incident.metadata.end).getTime() -
                        new Date(incident.metadata.start).getTime()) /
                        60000
                    )
                  )}
              </div>
            {/if}
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
  section {
    margin-bottom: 2rem;
  }
</style>
