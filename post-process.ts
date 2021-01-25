import { readFile, writeFile, copyFile, copy, remove, pathExists } from "fs-extra";
import { load } from "js-yaml";
import { join } from "path";
import { execSync } from "child_process";

export const postProcess = async () => {
  let config: {
    "status-website"?: {
      cname?: string;
      robotsText?: string;
      baseUrl?: string;
    };
  } = load(await readFile(join("..", ".upptimerc.yml"), "utf8")) as any;
  const baseUrl = (config["status-website"] || {}).baseUrl || "/";

  execSync(`sapper export --legacy --basepath ${baseUrl}`, {
    stdio: "inherit",
  });

  if (baseUrl !== "/") {
    await copy(join(".", "__sapper__", "export", baseUrl), join(".", "__sapper__", "export"));
    await remove(join(".", "__sapper__", "export", baseUrl));
  }

  try {
    if (await pathExists(join(".", "assets")))
      await copy(join(".", "assets"), join("__sapper__", "export"), { recursive: true });
  } catch (error) {}

  if (config["status-website"] && config["status-website"].cname)
    await writeFile(join(".", "__sapper__", "export", "CNAME"), config["status-website"].cname);

  if (config["status-website"] && config["status-website"].robotsText)
    await writeFile(
      join(".", "__sapper__", "export", "robots.txt"),
      config["status-website"].robotsText
    );

  await copyFile(
    join(".", "__sapper__", "export", "service-worker-index.html"),
    join(".", "__sapper__", "export", "404.html")
  );
};

postProcess();
