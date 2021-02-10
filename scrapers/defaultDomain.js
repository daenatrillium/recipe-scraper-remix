"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class DefaultDomainScraper extends BaseScraper {
  constructor(url) {
    super(url, "alexandracooks.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

  }
}

module.exports = DefaultDomainScraper;
