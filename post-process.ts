import { readFile, writeFile, copyFile, copy, remove } from "fs-extra";
import { safeLoad } from "js-yaml";
import { join } from "path";
import { execSync } from "child_process";

export const preProcess = async () => {
  let config: {
    "status-website"?: {
      cname?: string;
      baseUrl?: string;
    };
  } = safeLoad(await readFile(join(".", ".upptimerc.yml"), "utf8")) as any;
  const baseUrl = (config["status-website"] || {}).baseUrl || "/";

  execSync(`sapper export --legacy --basepath ${baseUrl}`, {
    stdio: "inherit",
  });

  if (baseUrl !== "/") {
    await copy(join(".", "__sapper__", "export", baseUrl), join(".", "__sapper__", "export"));
    await remove(join(".", "__sapper__", "export", baseUrl));
  }

  try {
    const file = await readFile(join("..", ".upptimerc.yml"), "utf8");
    if (file) {
      config = safeLoad(file) as any;
      console.log("Using root config instead");
    }
  } catch (error) {
    console.log("Root config not found 1 dir up");
  }

  try {
    const file = await readFile(join("..", "..", ".upptimerc.yml"), "utf8");
    if (file) {
      config = safeLoad(file) as any;
      console.log("Using root config instead");
    }
  } catch (error) {
    console.log("Root config not found 2 dirs up");
  }

  if (config["status-website"] && config["status-website"].cname)
    await writeFile(join(".", "__sapper__", "export", "CNAME"), config["status-website"].cname);
  await copyFile(
    join(".", "__sapper__", "export", "service-worker-index.html"),
    join(".", "__sapper__", "export", "404.html")
  );
};

preProcess();
