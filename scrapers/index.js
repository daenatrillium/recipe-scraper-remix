"use strict";

const ScraperFactory = require("../helpers/ScraperFactory");

const recipeScraper = async (url, scrapeFlag, jquery) => {
  let klass = new ScraperFactory().getScraper(url);
  return await klass.fetchRecipe(scrapeFlag, jquery);
};

module.exports = recipeScraper;
