"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class AlexandraCooksScraper extends BaseScraper {
  constructor(url) {
    super(url, "alexandracooks.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    const body = $(".wprm-recipe-container");
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $(".tasty-recipes-ingredients")
    .find("li")
    .each((i, el) => {
      ingredients.push($(el).text());
    })

    $(".tasty-recipes-instructions")
    .find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });


    time.prep = $(".tasty-recipes-prep-time").text();
    time.cook = $(".tasty-recipes-cook-time").text();
    time.total = $(".tasty-recipes-total-time").text();

    $(".tasty-recipes-yield-scale").remove();

    this.recipe.servings = $(".tasty-recipes-yield")
    .text()
    .trim();
  }
}

module.exports = AlexandraCooksScraper;
