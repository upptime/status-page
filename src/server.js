import * as sapper from "@sapper/server";
import compression from "compression";
import fs from "fs-extra";
import polka from "polka";
import sirv from "sirv";
import { load } from "js-yaml";
import { join } from "path";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

let config
if(fs.existsSync(join("..", ".uclirc.yml"))){
  config = load(fs.readFileSync(join("..", ".uclirc.yml"), "utf8"));
}else{
  config = load(fs.readFileSync(join("..", ".upptimerc.yml"), "utf8"));
}

const baseUrl = (config["status-website"] || {}).baseUrl || "/";

polka()
  .use(baseUrl, compression({ threshold: 0 }), sirv("static", { dev }), sapper.middleware())
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
