"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class FoodRepublicScraper extends BaseScraper {
  constructor(url) {
    super(url, "foodrepublic.com");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $("*[itemprop = 'recipeIngredient']")
    .each((i, el) => {
      ingredients.push($(el).text());
    });
    
    $("*[itemprop = 'recipeInstructions']").find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });

    
    

    time.prep = $(".prep-time").text().toString().replace("Prep Time: ","");
    time.cook = $(".cook-time").text().toString().replace("Cook Time: ","");
    this.recipe.servings = $(".servings").text().toString().replace("Serving Size: ","");

 
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

module.exports = FoodRepublicScraper;
