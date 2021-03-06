// @flow

require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");

const langsData = require("./static/languages.json");

module.exports = {
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true,
      }),
    ];

    return config;
  },
  exportPathMap() {
    const usedLangIds = ["en", "cz", "ro", "hu", "es", "fr", "de", "ru", "it"];
    const allLangs = Object.values(langsData).map(({ id, fallback }) => ({ id, fallback }));
    return allLangs.reduce((mapping, lang) => {
      const fallback = lang.fallback === "es-ES" ? "es" : "en";
      const translateTo = usedLangIds.includes(lang.id) ? lang.id : fallback;
      return {
        ...mapping,
        [`/${lang.id}/stopovers/dubai/index.html`]: { page: "/", query: { lang: translateTo } },
      };
    }, {});
  },
};
