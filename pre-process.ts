import { readFile, writeFile, writeJson, ensureDir } from "fs-extra";
import { load } from "js-yaml";
import { join } from "path";

export const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const getHtmlLanguage = (locale?: string) => {
  const language = locale?.trim();
  return language || "en";
};

export const updateTemplateLanguage = (template: string, locale?: string) => {
  const language = escapeHtmlAttribute(getHtmlLanguage(locale));
  return template.replace(/<html\b([^>]*)>/i, (_match, attributes: string) => {
    const attributesWithoutLanguage = attributes.replace(/\s+lang=(["'])[^"']*\1/gi, "");
    return `<html lang="${language}"${attributesWithoutLanguage}>`;
  });
};

const writeTemplateLanguage = async (locale?: string) => {
  const templatePath = join(".", "src", "template.html");
  const template = await readFile(templatePath, "utf8");
  await writeFile(templatePath, updateTemplateLanguage(template, locale));
};

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
      baseUrl?: string;
    };
  } = load(await readFile(join("..", ".upptimerc.yml"), "utf8")) as any;
  if (!config.owner || !config.repo) throw new Error("Owner/repo not set");
  config.path = `https://${config.owner}.github.io/${config.repo}`;
  if (config["status-website"]?.cname) config.path = `https://${config["status-website"].cname}${config["status-website"]?.baseUrl ?? ""}`;
  config.i18n = { ...i18n, ...config.i18n };
  await writeTemplateLanguage(config.i18n.locale);
  await ensureDir(join(".", "src", "data"));
  await writeJson(join(".", "src", "data", "config.json"), config);
};

if (require.main === module) preProcess();
