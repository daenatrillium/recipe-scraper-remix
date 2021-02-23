"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class TasteCookingScraper extends BaseScraper {
  constructor(url) {
    super(url, "tastecooking.com/");
  }

  scrape($) {
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");
    this.recipe.image = $("meta[name='twitter:image']").attr("content");


    $(".recipe-body-ingredient").each((i, el) => {
      var ingredientString = ""
      var quantity = $(el).find(".recipe-body-ingredient-quantity").find(".ingredient-number").text().trim();
      var quant_label = $(el).find(".recipe-body-ingredient-quantity").find(".ingredient-label").text().trim();
      if (quant_label === "c") {
        quant_label = "cups"
      }
      var ingredient = $(el).find(".recipe-body-ingredient-name").text().trim();
      ingredientString = ingredientString.concat(quantity, " ", quant_label, " ", ingredient);
      ingredients.push(ingredientString);
    })

    this.recipe.servings = $('[itemprop="recipeYield"]')
      .children(".recipe-stats-quantity")
      .text()
      .trim();

    $(".recipe-body-list-container").find("li").each((i, el) => {
      console.log("HERE IS EL TEXT: ", $(el).text());
      instructions.push($(el).text().trim());
    })

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

module.exports = TasteCookingScraper;
