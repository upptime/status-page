const { releaseMaster } = require("@koj/config");

module.exports = {
  ...releaseMaster,
  plugins: releaseMaster.plugins.map((plugin) => {
    const name = Array.isArray(plugin) ? plugin[0] : plugin;
    const options = Array.isArray(plugin) ? plugin[1] || {} : {};

    if (name === "@semantic-release/github") {
      return [
        "@semantic-release/github",
        {
          ...options,
          failComment: false,
          successComment: false,
        },
      ];
    }

    if (name === "@semantic-release/npm") {
      return [
        "@semantic-release/npm",
        {
          ...options,
          npmPublish: true,
        },
      ];
    }

    return plugin;
  }),
};
