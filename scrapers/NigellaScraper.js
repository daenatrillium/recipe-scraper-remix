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


    if (!this.recipe.image) {
      console.log("undefined recipe image")
      this.recipe.image = $(".recipe-image").find("img").first().attr("src")
    }


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

module.exports =NigellaScraper;
