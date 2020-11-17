<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../data/config.json";

  let token = "";
  let localStorageToken = false;
  const save = () => {
    if (typeof window !== "undefined" && "localStorage" in window)
      window.localStorage.setItem("personal-access-token", token);
    goto("/");
  };
  const remove = () => {
    token = "";
    localStorageToken = false;
    if (typeof window !== "undefined" && "localStorage" in window)
      window.localStorage.removeItem("personal-access-token");
  };
  onMount(() => {
    if (
      typeof window !== "undefined" &&
      "localStorage" in window &&
      localStorage.getItem("personal-access-token")
    )
      localStorageToken = true;
  });
</script>

<style>
  p.lead {
    font-size: 110%;
  }
  label span {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  input,
  button {
    font: inherit;
    padding: 0.5rem 1rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.25);
    border-radius: 0.2rem;
  }
  input {
    width: 15rem;
    max-width: 100%;
  }
  button {
    background-color: #01a3a4;
    color: #fff;
    border-color: transparent;
  }
</style>

<svelte:head>
  <!-- <title>{config.i18n.incidentTitle}</title> -->
  <title>Rate limit exceeded</title>
</svelte:head>

<h1>Rate limit exceeded</h1>

<p class="lead">
  You have exceeded the number of requests you can do in an hour, so you'll have to wait before
  accessing this website again. Alternately, you can add a GitHub Personal Access Token to continue
  to use this website.
</p>

<h2>What does this error mean?</h2>

<p>
  This website uses the GitHub API to access real-time data about our websites' status. By default,
  GitHub allows each IP address 60 requests per hour, which you have consumed.
</p>

<h2>How can I fix it?</h2>

<p>
  You can wait for another hour and your IP address' limit will be restored. Alternately, you can
  add your GitHub Personal Access Token, which gives you an additional 5,000 requests per hour. You
  can
  <a
    href="https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token"
    target="_blank">learn how to generate a Personal Access Token</a>
  on the GitHub documentation.
</p>

{#if localStorageToken}
  <p>You have a personal access token set.</p>
  <button on:click={remove}>Remove token</button>
{:else}
  <form on:submit|preventDefault={save}>
    <label>
      <span>GitHub Personal Access Token</span>
      <input type="text" bind:value={token} placeholder="Copy and paste your token" />
    </label>
    <button type="submit">Save token</button>
  </form>
{/if}
