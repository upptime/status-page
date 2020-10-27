import * as sapper from "@sapper/server";
import compression from "compression";
import fs from "fs";
import polka from "polka";
import sirv from "sirv";
import { safeLoad } from "js-yaml";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const configFile = safeLoad(fs.readFileSync(".upptimerc.yml", "utf8"));

polka()
  .use(
    (configFile || {})["status-website"].baseUrl || "/",
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
