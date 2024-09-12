const asyncHandler = require("../utils/async-handler");
const { PrismicError } = require("@prismicio/client");
const prismic = require("@prismicio/client");
const { client } = require("../config/index");
const { siteConfig } = require("../config/index");

const router = require("express").Router();

const handleDefaultRequests = async (lang) => {
  return {};
};

const checkLanguage = (req, res, next) => {
  const lang = req.params.lang;
  if (!siteConfig.supportedLanguages.includes(lang)) {
    return res
      .status(404)
      .render("pages/404", { lang: siteConfig.defaultLanguage });
  }
  next();
};

router.get("/", (req, res) => {
  res.redirect(siteConfig.defaultLanguage);
});

router.get(
  "/:lang/*",
  checkLanguage,
  asyncHandler(async (req, res) => {
    const lang = req.params.lang;
    res.status(404).render("pages/404", { lang });
  })
);

router.get(
  "/:lang",
  checkLanguage,
  asyncHandler(async (req, res, next) => {
    const lang = req.params.lang;

    res.render("pages/home", { lang });
  })
);

// router.get(
//   "/:lang",
//   asyncHandler(async (req, res, next) => {
//     const lang = req.params.lang;

//     console.error("lang", lang);

//     // if (!lang) {
//     //   return next(new Error("Language parameter is missing"));
//     // }

//     // const defaults = await handleDefaultRequests(lang);

//     // if (!siteConfig.supportedLanguages.includes(lang)) {
//     //   res.status(404).render("pages/404", { ...defaults, lang: lang });
//     // }

//     // const document = await client
//     //   .getSingle("home", {
//     //     fetchLinks: [
//     //       "product.image",
//     //       "product_showcase.product",
//     //       "product.title",
//     //       "collection.collection_title",
//     //       "article.label",
//     //       "article.featured_image",
//     //     ],
//     //     lang: lang || "",
//     //   })
//     //   .catch((err) => {
//     //     if (
//     //       !(err instanceof PrismicError) ||
//     //       err.message !== "No documents were returned"
//     //     ) {
//     //       console.log(err);
//     //     }
//     //     return null;
//     //   });

//     // if (!document) {
//     //   res.status(404).render("pages/404", { ...defaults, lang: lang });
//     // } else {
//     //   res.render("pages/home", { ...defaults, document });
//     // }

//     res.render("pages/home");
//   })
// );

router.get("*", (req, res) => {
  console.log("wildcard");
  res.status(404).render("pages/404");
});

module.exports = router;
