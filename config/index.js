require("dotenv").config();

const fetch = import("node-fetch");
const prismic = require("@prismicio/client");

const endpoint = process.env.PRISMIC_ENDPOINT;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

const routes = [
  {
    type: "home",
    uid: "home",
    lang: "*",
    path: "/:lang",
  },
  {
    type: "page",
    uid: "page",
    lang: "*",
    path: "/:lang/:uid",
  },
];

function linkResolver(doc) {
  if (doc.type === "home") {
    return `/${doc.lang.split("-")[0]}`;
  } else if (doc.type === "page") {
    return `/${doc.lang.split("-")[0]}/${doc.uid}`;
  } else {
    return null;
  }
}

function parseDocumentFields(document, fields) {
  const regex = /\*\*\*(.*?)\*\*\*/g;

  fields.forEach((field) => {
    if (document.data[field]) {
      const originalText = document.data[field];
      const modifiedText = originalText.replace(
        regex,
        '<span class="highlight" data-toggle="popup">$1</span>'
      );

      document.data[field] = `<p>${modifiedText}</p>`;
    }
  });

  return document;
}

function linkReplace(text) {
  return text.replace(/([a-z]{2})-ca/g, "$1");
}

module.exports.client = prismic.createClient(endpoint, {
  fetch,
  accessToken,
  brokenRoute: "/404",
  routes,
  linkResolver,
});

module.exports.siteConfig = {
  defaultLanguage: {
    full: "en-ca",
    short: "en",
  },
  supportedLanguages: {
    en: {
      full: "en-ca",
      short: "en",
    },
    fr: {
      full: "fr-ca",
      short: "fr",
    },
  },
  linkResolver,
  parseDocumentFields,
  linkReplace,
};
