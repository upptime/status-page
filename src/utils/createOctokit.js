import { Octokit } from "@octokit/rest";
import config from "../data/config.json";

const { apiBaseUrl: baseUrl } = config["status-website"] || {};
const userAgent = config.userAgent;

export const createOctokit = () => {
  let token = "";
  if (
    typeof window !== "undefined" &&
    "localStorage" in window &&
    localStorage.getItem("personal-access-token")
  )
    token = localStorage.getItem("personal-access-token");
  return new Octokit({
    baseUrl,
    userAgent,
    auth: token || undefined,
  });
};

export const handleError = (error) => {
  if (error.message === "Bad credentials") {
    window.location.href = "/error";
  } else if ((error.message || "").indexOf("rate limit exceeded")) {
    window.location.href = "/rate-limit-exceeded";
  } else {
    window.location.href = "/error";
    console.log(error.message);
  }
};
