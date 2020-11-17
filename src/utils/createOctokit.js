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
  console.log("Error handler 123", error);
};
