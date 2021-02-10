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
    if (!this.recipe.name) {
      this.recipe.name = $("title").text();
    } 

    console.log("HERE IS RECIPE NAME: ", this.recipe.name);

    if (!this.recipe.image) {
      console.log("undefined recipe image")
      this.recipe.image = $(".recipe-image").find("img").first().attr("src")
    }

    console.log("HERE IS RECIPE IMAGE: ", this.recipe.image);


    $("*[itemprop = 'recipeIngredient']").each((i, el) => {
      ingredients.push(
        $(el)
          .text()
          .trim()
      );
    });

    console.log("HERE IS RECIPE INGREDIENTS: ", ingredients);


    $("*[itemprop = 'recipeInstructions']")
    .find("ol")
    .find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });

    console.log("HERE IS RECIPE INSTRUCTIONS: ", instructions);

    let recipeServings = $("*[itemprop = 'recipeYield']").text()

    if (recipeServings) {
      this.recipe.servings = recipeServings.toLowerCase().replace(":","").replace("makes","").trim()
    }
  }
}

module.exports =NigellaScraper;
