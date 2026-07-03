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

const getHeader = (headers, name) => {
  if (!headers) return undefined;
  return headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
};

export const isRateLimitError = (error) => {
  if (!error || error.message === "Bad credentials") return false;

  const message = String(error.message || "").toLowerCase();
  const documentationUrl = String(
    error.documentation_url ||
      (error.response && error.response.data && error.response.data.documentation_url) ||
      ""
  ).toLowerCase();
  const status = error.status || (error.response && error.response.status);
  const remaining = getHeader(error.response && error.response.headers, "x-ratelimit-remaining");

  return (
    message.indexOf("rate limit") > -1 ||
    documentationUrl.indexOf("rate-limit") > -1 ||
    (status === 403 && remaining === "0")
  );
};

export const getErrorPath = (error) => (isRateLimitError(error) ? "/rate-limit-exceeded" : "/error");

export const handleError = (error) => {
  const errorPath = getErrorPath(error);
  window.location.href = config.path + errorPath;
  if (errorPath === "/error" && error && error.message !== "Bad credentials") console.log(error.message);
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
