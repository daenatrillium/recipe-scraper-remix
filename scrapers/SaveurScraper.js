"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class SaveurScraper extends BaseScraper {
  constructor(url) {
    super(url, "saveur.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $(".ingredient")
    .each((i, el) => {
      ingredients.push($(el).text());
    });
    
    $(".instruction")
    .each((i, el) => {
      instructions.push($(el).text());
    });


    time.total = $(".cook-time").text().trim().replace("Time:", "");

    this.recipe.servings = $(".yield").text().trim().replace("Yield:", "").replace("serves","");


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

module.exports = SaveurScraper;
