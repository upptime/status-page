<script>
  import config from "../data/config.json";
  export let segment;
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
    background-color: #fff;
    margin-bottom: 2rem;
    white-space: nowrap;
    overflow-x: auto;
  }

  @media (prefers-color-scheme: dark) {
    nav {
      background-color: #004f4b;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: center;
  }

  [aria-current] {
    border-bottom: 2px solid #3498db;
  }

  a {
    text-decoration: none;
    padding: 1.5rem 2rem;
    display: block;
  }

  .logo {
    float: left;
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    font-weight: bold;
    margin-right: 2rem;
  }
  .logo img {
    margin-right: 1rem;
    height: 3rem;
    border-radius: 0.2rem;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<nav>
  <div class="container">
    {#if config['status-website'] && config['status-website'].logoUrl}
      <div>
        <a href={config['status-website'].logoHref || config.path} class="logo">
          <img alt="" src={config['status-website'].logoUrl} />
          <div>{config['status-website'].name}</div>
        </a>
      </div>
    {/if}
    <ul>
      {#if config['status-website'] && config['status-website'].navbar}
        {#each config['status-website'].navbar as item}
          <li>
            <a
              aria-current={segment === (item.href === '/' ? undefined : item.href) ? 'page' : undefined}
              href={item.href.replace('$OWNER', config.owner).replace('$REPO', config.repo)}>
              {item.title}
            </a>
          </li>
        {/each}
      {/if}
      {#if config['status-website'] && config['status-website'].navbarGitHub && !config['status-website'].navbar}
        <li>
          <a href={`https://github.com/${config.owner}/${config.repo}`}>
            {config.i18n.navGitHub}
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>
