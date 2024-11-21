const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://146.190.64.108:3000",
    supportFile: false,
  },

  integration: {
    baseUrl: "http://146.190.64.108:3000",
    // Additional integration-specific configuration
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
