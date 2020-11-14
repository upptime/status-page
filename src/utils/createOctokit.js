import { Octokit } from "@octokit/rest";
import config from "../data/config.json";

const { apiBaseUrl: baseUrl } = config["status-website"]
const userAgent = config.userAgent;

export const createOctokit = () =>
  new Octokit({
    baseUrl,
    userAgent,
  });