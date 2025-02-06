require("dotenv").config();

const asyncHandler = require("../utils/async-handler");
const { client } = require("../config/index");
const { siteConfig } = require("../config/index");
const prismicHelper = require("@prismicio/helpers");

const connectDB = require("../config/mongoose");
const RepCounter = require("../models/RepCounter");

const router = require("express").Router();

connectDB();

const handleDefaultRequests = async (lang) => {
  let navigation = null;
  let logo = null;

  try {
    navigation = await client.getSingle("navigation", {
      lang: lang || siteConfig.defaultLanguage.full,
    });
  } catch (error) {
    console.error("Error fetching navigation:", error.message);
    navigation = null;
  }

  try {
    logo = await client.getSingle("logo", {
      lang: lang || siteConfig.defaultLanguage.full,
    });
  } catch (error) {
    console.error("Error fetching logo:", error.message);
    logo = null;
  }

  if (logo) {
    if (!logo.data.frames) {
      logo.data.frames = [];
    }

    Object.keys(logo.data).forEach((key) => {
      if (Array.isArray(logo.data[key])) {
        logo.data[key].forEach((item, index) => {
          if (item.image) {
            const frame = {
              ...item.image,
              label: `${key.replace(/_/g, "-")}-${index + 1}`,
            };
            logo.data.frames.push(frame);
          }
        });
      } else if (logo.data[key].image) {
        const frame = {
          ...logo.data[key].image,
          label: key.replace(/_/g, "-"),
        };
        logo.data.frames.push(frame);
      } else if (logo.data[key].url) {
        const frame = {
          ...logo.data[key],
          label: key.replace(/_/g, "-"),
        };
        logo.data.frames.push(frame);
      }
    });
  }

  return { navigation, logo };
};

const handleLanguageMatching = (lang) => {
  const matchedLanguage = Object.values(siteConfig.supportedLanguages).find(
    (language) => language.short === lang
  );

  if (!matchedLanguage) {
    return null;
  } else {
    return matchedLanguage.full;
  }
};

const condenseFrames = () => {};

router.get("/", (req, res) => {
  res.redirect(`/${siteConfig.defaultLanguage.short}`);
});

router.get(
  "/:lang/:uid",
  asyncHandler(async (req, res) => {
    const lang = req.params.lang;
    const uid = req.params.uid;

    const fullLang = handleLanguageMatching(lang);
    const defaults = await handleDefaultRequests(fullLang);

    if (!fullLang) {
      return res.status(404).render("pages/404", {
        link: `/${siteConfig.defaultLanguage.short}`,
        ...defaults,
      });
    }

    let document = null;

    try {
      document = await client.getByUID("page", uid, { lang: fullLang });
    } catch (error) {
      console.error(`Error fetching page with uid - ${uid}:`, error.message);
      document = null;

      console.log("defaults - ", defaults);
    }

    if (!document) {
      return res.status(404).render("pages/404", {
        link: `/${siteConfig.defaultLanguage.short}`,
        ...defaults,
      });
    }

    res.render(`pages/${uid}`, { document, ...defaults });
  })
);

router.get(
  "/:lang",
  asyncHandler(async (req, res) => {
    const lang = req.params.lang;

    const fullLang = handleLanguageMatching(lang);
    const defaults = await handleDefaultRequests(fullLang);

    if (!fullLang) {
      return res.status(404).render("pages/404", {
        link: `/${siteConfig.defaultLanguage.short}`,
        ...defaults,
      });
    }

    let document = null;

    try {
      document = await client.getSingle("home", { lang: fullLang });
    } catch (error) {
      console.error(`Error fetching home:`, error.message);
      document = null;
    }

    if (!document) {
      return res.status(404).render("pages/404", {
        link: `/${siteConfig.defaultLanguage.short}`,
        ...defaults,
      });
    }

    document = siteConfig.parseDocumentFields(document, ["intro_text"]);

    console.log(
      "document - ",
      document.data.body,
      prismicHelper.asHTML(document.data.body[0].primary.text_content)
    );

    res.render("pages/home", { document, ...defaults });
  })
);

router.get(
  "*",
  asyncHandler(async (req, res) => {
    const lang = req.params.lang;

    const fullLang = handleLanguageMatching(lang);
    const defaults = await handleDefaultRequests(fullLang);

    console.log("defaults - ", defaults);

    if (!fullLang) {
      return res.status(404).render("pages/404", {
        link: `/${siteConfig.defaultLanguage.short}`,
        ...defaults,
      });
    }

    res.status(404).render("pages/404", { link, ...defaults });
  })
);

module.exports = router;
