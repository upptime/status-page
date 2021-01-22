<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../data/config.json";

  let token = "";
  let localStorageToken = false;
  const save = () => {
    if (typeof window !== "undefined" && "localStorage" in window)
      window.localStorage.setItem("personal-access-token", token);
    goto(config.path);
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

<svelte:head>
  <title>{config.i18n.rateLimitExceededTitle}</title>
</svelte:head>

<h1>{config.i18n.rateLimitExceededTitle}</h1>

<p class="lead">{config.i18n.rateLimitExceededIntro}</p>

<h2>{config.i18n.rateLimitExceededWhatDoesErrorMean}</h2>

<p>{config.i18n.rateLimitExceededErrorMeaning}</p>

<h2>{config.i18n.rateLimitExceededErrorHowCanFix}</h2>

<p>
  {config.i18n.rateLimitExceededErrorFix}
  <a
    href="https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token"
    target="_blank">{config.i18n.rateLimitExceededGeneratePAT}</a
  >
</p>

{#if localStorageToken}
  <p>{config.i18n.rateLimitExceededHasSet}</p>
  <button on:click={remove}>{config.i18n.rateLimitExceededRemoveToken}</button>
{:else}
  <form on:submit|preventDefault={save}>
    <label>
      <span>{config.i18n.rateLimitExceededGitHubPAT}</span>
      <input
        type="text"
        bind:value={token}
        placeholder={config.i18n.rateLimitExceededCopyPastePAT}
      />
    </label>
    <button class="submit-button" type="submit">{config.i18n.rateLimitExceededSaveToken}</button>
  </form>
{/if}

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
</style>
