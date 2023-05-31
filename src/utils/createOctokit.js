import { Octokit } from "@octokit/rest";
import config from "../data/config.json";

let { apiBaseUrl, userContentBaseUrl } = config["status-website"] || {};
if (!apiBaseUrl) apiBaseUrl = "https://api.github.com";
if (!userContentBaseUrl) userContentBaseUrl = "https://raw.githubusercontent.com";

const userAgent = config.userAgent;

export const createOctokit = () => {
  let token = "";
  if (
    typeof window !== "undefined" &&
    "localStorage" in window &&
    localStorage.getItem("personal-access-token")
  )
    token = localStorage.getItem("personal-access-token");

  const baseUrl = apiBaseUrl;
  return new Octokit({
    baseUrl,
    userAgent,
    auth: token || undefined,
  });
};

export const handleError = (error) => {
  if (error.message === "Bad credentials") {
    window.location.href = config.path + "/error";
  } else if ((error.message || "").indexOf("rate limit exceeded") > -1) {
    window.location.href = config.path + "/rate-limit-exceeded";
  } else {
    window.location.href = config.path + "/error";
    console.log(error.message);
  }
};

/**
 * Memoize a GitHub API response in local storage
 * @param {string} key - Local storage cache key
 * @param {Function} fn - Function that returns the result
 */
export const cachedResponse = async (key, fn) => {
  try {
    if (typeof window !== "undefined") {
      if ("localStorage" in window && typeof document !== "undefined" && "domain" in document) {
        const data = localStorage.getItem(key);
        if (data) {
          const item = JSON.parse(data);
          if (
            new Date().getTime() - new Date(item.createdAt || "").getTime() >
            (document.domain === "localhost"
              ? config["status-website"].localhostCacheTime || 3600000
              : config["status-website"].productionCacheTime || 120000)
          ) {
            localStorage.removeItem(key);
          } else {
            return item.data;
          }
        }
      }
    }
  } catch (error) {}
  const i = await fn();
  localStorage.setItem(key, JSON.stringify({ data: i, createdAt: new Date() }));
  return i;
};
