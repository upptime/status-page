/// <reference types="jest" />

import { getHtmlLanguage, updateTemplateLanguage } from "./pre-process";

describe("preProcess template language", () => {
  it("uses the configured locale for the HTML lang attribute", () => {
    const template = '<!DOCTYPE html>\n<html lang="en">\n  <head></head>\n</html>\n';

    expect(updateTemplateLanguage(template, "pt-BR")).toBe(
      '<!DOCTYPE html>\n<html lang="pt-BR">\n  <head></head>\n</html>\n'
    );
  });

  it("escapes the locale before writing it into the HTML attribute", () => {
    const template = '<html lang="en"></html>';

    expect(updateTemplateLanguage(template, 'en" data-test="bad')).toBe(
      '<html lang="en&quot; data-test=&quot;bad"></html>'
    );
  });

  it("falls back to English when no locale is configured", () => {
    expect(getHtmlLanguage("   ")).toBe("en");
    expect(updateTemplateLanguage("<html></html>")).toBe('<html lang="en"></html>');
  });

  it("replaces existing lang attributes instead of appending duplicates", () => {
    expect(updateTemplateLanguage('<html lang="en" lang="en-US" dir="ltr"></html>', "fr-FR")).toBe(
      '<html lang="fr-FR" dir="ltr"></html>'
    );
  });
});
