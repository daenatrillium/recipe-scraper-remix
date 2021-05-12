"use strict";

const BaseScraper = require("../helpers/BaseScraper");

/**
 * Class for scraping bbc.co
 * @extends BaseScraper
 */
class SeriousEatsScraper extends BaseScraper {
  constructor(url) {
    super(url, "seriouseats.com/");
    if (this.url && this.url.includes("seriouseats.com/sponsored/")) {
      throw new Error("seriouseats.com sponsored recipes not supported");
    }
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $(".heading__title")
      .text()
      .replace(/\s\s+/g, "");

    $(".ingredient").each((i, el) => {
      ingredients.push($(el).text());
    });

    time.active = $("#active-time_1-0")
      .children("meta-text__data").text()
    
    time.total = $(".project-meta__total-time")
      .children("#meta-text_1-0").children("meta-text__data").text()

    this.recipe.servings = $(".project-meta__recipe-serving")
      .children("#meta-text_6-0").children("meta-text__data").text()


    let tagsSet = new Set();
    $("li[class='label label-category top-level']").each((i, el) => {
      let text = $(el)
        .find("a")
        .text();
      if (text) {
        tagsSet.add(text);
      }
    });

    this.recipe.tags = Array.from(tagsSet);

    $(".recipe-procedure-text").each((i, el) => {
      instructions.push(
        $(el)
          .text()
          .replace(/\s\s+/g, "")
      );
    });
  }
}

module.exports = SeriousEatsScraper;
