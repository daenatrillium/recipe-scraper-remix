"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class NigellaScraper extends BaseScraper {
  constructor(url) {
    super(url, "nigella.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $("*[itemprop = 'recipeIngredient']").each((i, el) => {
      ingredients.push(
        $(el)
          .text()
          .trim()
      );
    });

    $("*[itemprop = 'recipeInstructions']")
    .find("ol")
    .find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });

    $(".tasty-recipes-yield-scale").remove();

    let recipeServings = $("*[itemprop = 'recipeYield']").text()

    if (recipeServings) {
      this.recipe.servings = recipeServings.toLowerCase().replace(":","").replace("makes","").trim()
    }
  }
}

module.exports =NigellaScraper;
