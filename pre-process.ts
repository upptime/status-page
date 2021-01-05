import { readFile, writeJson, ensureDir } from "fs-extra";
import { load } from "js-yaml";
import { join } from "path";

export const preProcess = async () => {
  const i18n = load(await readFile(join(".", "i18n.yml"), "utf8")) as {
    [index: string]: string;
  };

  let config: {
    logoUrl?: string;
    name?: string;
    owner: string;
    repo: string;
    introTitle?: string;
    introMessage?: string;
    path: string;
    i18n?: { [index: string]: string };
    "status-website"?: {
      cname?: string;
    };
  } = load(await readFile(join("..", ".upptimerc.yml"), "utf8")) as any;
  if (!config.owner || !config.repo) throw new Error("Owner/repo not set");
  config.path = `https://${config.owner}.github.io/${config.repo}`;
  if (config["status-website"]?.cname) config.path = `https://${config["status-website"].cname}`;
  config.i18n = { ...i18n, ...config.i18n };
  await ensureDir(join(".", "src", "data"));
  await writeJson(join(".", "src", "data", "config.json"), config);
};

preProcess();
