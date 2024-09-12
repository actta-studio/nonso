require("dotenv").config();

const fetch = import("node-fetch");
const prismic = require("@prismicio/client");

const repoName = process.env.PRISMIC_REPO_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

const routes = [
  {
    type: "homepage",
    path: "/",
  },
  {
    type: "page",
    path: "/:uid",
  },
];

module.exports.client = prismic.createClient(repoName, {
  fetch,
  accessToken,
  routes,
});

module.exports.siteConfig = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr"],
  handleLinkResolver: (doc) => {
    return `/${doc.lang}/`;
  },
};
