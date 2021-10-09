"use strict";

const BaseScraper = require("../helpers/BaseScraper");

/**
 * Class for scraping foodandwine.com
 * @extends BaseScraper
 */
class NYTimesScraper extends BaseScraper {
  constructor(url) {
    super(url, "cooking.nytimes.com/recipes");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $(".recipe-ingredients")
      .find("li")
      .each((i, el) => {
        ingredients.push($(el).text().trim());
      });

    $(".recipe-steps")
      .find("li")
      .each((i, el) => {
        instructions.push($(el).text());
      });
  }
}

module.exports = NYTimesScraper;
