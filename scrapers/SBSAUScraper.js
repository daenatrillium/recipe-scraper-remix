"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class SBSAUScraper extends BaseScraper {
  constructor(url) {
    super(url, "sbs.com");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $(".field-name-field-ingredients").find("li")
    .each((i, el) => {
      ingredients.push($(el).text());
    });
    
    $(".field-name-field-cooking-instructions").find("li")
    .each((i, el) => {
      instructions.push($(el).text());
    });

    
    

    time.prep = $(".field-name-field-preparation-time").find(".time-periods").text();
    time.cook = $(".field-name-field-cooking-time").find(".time-periods").text();
    this.recipe.servings = $("*[itemprop = 'recipeYield']").text()
 
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

module.exports = SBSAUScraper;
