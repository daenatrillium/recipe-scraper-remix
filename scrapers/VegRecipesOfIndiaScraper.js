"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class VegRecipesOfIndiaScraper extends BaseScraper {
  constructor(url) {
    super(url, "vegrecipesofindia.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");
    $(".wprm-recipe-ingredients")
    .find("li")
    .each((i, el) => {
      ingredients.push($(el).text());
    });

  $(".wprm-recipe-instructions")
    .find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });


    time.prep = $(".wprm-recipe-prep-time-container").find(".wprm-recipe-time").text();
    time.cook = $(".wprm-recipe-cook-time-container").find(".wprm-recipe-time").text();
    time.total = $(".wprm-recipe-total-time-container").find(".wprm-recipe-time").text();

    this.recipe.servings = $(".wprm-recipe-servings").text().trim();

    if(!this.recipe.servings) {
      Recipe.servings = $(".wprm-recipe-servings-with-unit")
      .text()
      .trim();
  }
  }
}

module.exports = VegRecipesOfIndiaScraper;
