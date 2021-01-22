<script>
  import Loading from "../components/Loading.svelte";
  import { onMount } from "svelte";
  import config from "../data/config.json";
  import Line from "svelte-chartjs/src/Line.svelte";
  import { cachedResponse, createOctokit, handleError } from "../utils/createOctokit";

  export let slug;
  let loading = true;
  const octokit = createOctokit();
  const owner = config.owner;
  const repo = config.repo;
  let commits = [];
  let labels = [];
  let data = [];
  let width = 800;

  onMount(async () => {
    try {
      commits = (
        await cachedResponse(`commits-${owner}-${repo}-${slug}`, () =>
          octokit.repos.listCommits({
            owner,
            repo,
            path: `history/${slug}.yml`,
            per_page: 28,
          })
        )
      ).data.reverse();
    } catch (error) {
      handleError(error);
    }
    commits = commits.map((commit, index) => {
      commit.showHeading =
        index === 0 ||
        new Date(commits[index - 1].created_at).toLocaleDateString() !==
          new Date(commit.created_at).toLocaleDateString();
      return commit;
    });
    data = commits
      .filter((commit) => commit.commit.message.includes("ms) [skip ci]"))
      .map((commit) => parseInt(commit.commit.message.split(" in ")[1].split("ms")[0]));
    labels = commits
      .filter((commit) => commit.commit.message.includes("ms) [skip ci]"))
      .map((commit) => new Date(commit.commit.committer.date).toLocaleString());
    loading = false;
  });
</script>

<section bind:clientWidth={width}>
  {#if loading}
    <Loading />
  {:else if data.length}
    <h2>{config.i18n.sevelDayResponseTime}</h2>
    <Line
      data={{
        labels,
        datasets: [
          {
            label: config.i18n.responseTimeMs,
            backgroundColor: config.graphBackgroundColor || "#89e0cf",
            borderColor: config.graphBorderColor || "#1abc9c",
            data,
          },
        ],
      }}
      {width}
      height={400}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        scales: { xAxes: [{ display: false, gridLines: { display: false } }] },
      }}
    />
  {/if}
</section>
