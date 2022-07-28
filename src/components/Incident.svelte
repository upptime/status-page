<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import snarkdown from "snarkdown";
  import config from "../data/config.json";
  import { cachedResponse, createOctokit, handleError } from "../utils/createOctokit";

  export let number;

  let md = snarkdown;
  let loading = true;
  let loadingIncident = true;

  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let comments = [];
  let incident = {};

  onMount(async () => {
    try {
      incident = (
        await cachedResponse(`issue-${owner}-${repo}-${number}`, () =>
          octokit.issues.get({
            owner,
            repo,
            issue_number: number,
            sort: "created",
            direction: "desc",
          })
        )
      ).data;
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
    } catch (error) {
      handleError(error);
    }
    loadingIncident = false;
    try {
      comments = (
        await cachedResponse(`issue-comments-${owner}-${repo}-${number}`, () =>
          octokit.issues.listComments({
            owner,
            repo,
            issue_number: number,
          })
        )
      ).data.reverse();
    } catch (error) {
      handleError(error);
    }
    loading = false;
  });
</script>

<svelte:head>
  <title>{config.i18n.incidentTitle.replace("$NUMBER", number)}</title>
</svelte:head>

<h2>
  {#if loadingIncident}
    {config.i18n.incidentDetails}
  {:else}
    {incident.title}
    <span class={`tag ${incident.state}`}>
      {incident.state === "closed"
        ? incident.metadata.start
          ? config.i18n.incidentCompleted
          : config.i18n.incidentFixed
        : incident.metadata.start
        ? config.i18n.incidentScheduled
        : config.i18n.incidentOngoing}
    </span>
  {/if}
</h2>

<section>
  {#if loading}
    <Loading />
  {:else}
    <div class="f">
      <dl>
        {#if incident.metadata.start}
          <dt>
            {new Date(incident.metadata.start).getTime() < new Date().getTime()
              ? config.i18n.startedAt
              : config.i18n.startsAt}
          </dt>
          <dd>{new Date(incident.metadata.start).toLocaleString()}</dd>
        {:else}
          <dt>{config.i18n.incidentOpenedAt}</dt>
          <dd>{new Date(incident.created_at).toLocaleString()}</dd>
        {/if}
        {#if incident.metadata.start && incident.metadata.end}
          <dt>{config.i18n.duration}</dt>
          <dd>
            {config.i18n.durationMin.replace(
              /\$DURATION/g,
              Math.floor(
                (new Date(incident.metadata.end).getTime() -
                  new Date(incident.metadata.start).getTime()) /
                  60000
              )
            )}
          </dd>
        {:else if incident.closed_at}
          <dt>{config.i18n.incidentClosedAt}</dt>
          <dd>{new Date(incident.closed_at).toLocaleString()}</dd>
        {/if}
      </dl>
      <div class="r">
        <p>
          <a href={`https://github.com/${config.owner}/${config.repo}/issues/${number}`}>
            {config.i18n.incidentViewOnGitHub}
          </a>
        </p>
      </div>
    </div>
    {#each comments as comment}
      <article>
        <p>
          {@html md(comment.body)}
        </p>
        <div>
          {@html config.i18n.incidentCommentSummary
            .replace(
              /\$DATE/g,
              `<a href=${comment.html_url}>${new Date(comment.created_at).toLocaleString()}</a>`
            )
            .replace(/\$AUTHOR/g, `<a href=${comment.user.html_url}>@${comment.user.login}</a>`)}
        </div>
      </article>
    {/each}
  {/if}
</section>

<footer><a href={config.path}>{config.i18n.incidentBack}</a></footer>

<style>
  footer {
    margin-top: 2rem;
  }
  p {
    margin-top: 0;
  }
  h2 {
    line-height: 1;
  }
  .r {
    text-align: right;
  }
</style>
