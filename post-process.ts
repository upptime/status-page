import { readFile, writeFile, copyFile, copy, remove } from "fs-extra";
import { load } from "js-yaml";
import { join } from "path";
import { execSync } from "child_process";

export const postProcess = async () => {
  let config: {
    "status-website"?: {
      cname?: string;
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

  if (config["status-website"] && config["status-website"].cname)
    await writeFile(join(".", "__sapper__", "export", "CNAME"), config["status-website"].cname);
  await copyFile(
    join(".", "__sapper__", "export", "service-worker-index.html"),
    join(".", "__sapper__", "export", "404.html")
  );
};

postProcess();
