"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class ArchanasKitchenScraper extends BaseScraper {
  constructor(url) {
    super(url, "archanaskitchen.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $("*[itemprop = 'ingredients']").each((i, el) => {
      ingredients.push(
        $(el)
          .text()
          .trim()
      );
    });

    $("*[itemprop = 'recipeInstructions']")
    .each((i, el) => {
      instructions.push($(el).text());
    });


    let prepTime = $("*[itemprop = 'prepTime']").text()
    if (prepTime) {
      time.prep = prepTime ? prepTime.match(/\d+/)[0] : ""
    }

    let cookTime = $("*[itemprop = 'cookTime']").text()
    if (cookTime) {
      time.cook = cookTime ? cookTime.match(/\d+/)[0] : ""
    }

    let totalTime = $("*[itemprop = 'totalTime']").text()
    if (totalTime) {
      time.total = totalTime ? totalTime.match(/\d+/)[0] : ""
    }

    let recipeServings = $("*[itemprop = 'recipeYield']").text()
    if (recipeServings) {
      this.recipe.servings = recipeServings.toLowerCase().replace(":","").replace("makes","").trim()
    }


    if (!this.recipe.image) {
      this.recipe.image = ""  
    }

    if (!this.recipe.servings) {
      this.recipe.servings = ""  
    }

    if (!this.recipe.instructions) {
      this.recipe.instructions = [] 
    }
  }
}

module.exports = ArchanasKitchenScraper;
