"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class TheWoksOfLifeScraper extends BaseScraper {
  constructor(url) {
    super(url, "thewoksoflife.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    $(".wprm-recipe-ingredient")
    .each((i, el) => {
      ingredients.push($(el).text());
    });

    $(".wprm-recipe-instruction-text")
    .each((i, el) => {
      instructions.push($(el).text());
    });

    var prepTime = $(".wprm-recipe-prep-time-container")
    .find(".wprm-recipe-prep_time").text()
    var prepMin = $(".wprm-recipe-prep-time-container")
    .find(".wprm-recipe-prep_time-unit").text()
    time.prep = prepTime.concat(" ").concat(prepMin)

    var totalTime = $(".wprm-recipe-total-time-container")
    .find(".wprm-recipe-total_time").text()
    var totalMin = $(".wprm-recipe-total-time-container")
    .find(".wprm-recipe-total_time-unit").text()
    time.total = totalTime.concat(" ").concat(totalMin)

    this.recipe.servings = $(".wprm-recipe-servings").text()


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

module.exports = TheWoksOfLifeScraper;
