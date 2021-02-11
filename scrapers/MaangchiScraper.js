"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class MaangchiScraper extends BaseScraper {
  constructor(url) {
    super(url, "maangchi.com/");
  }

  scrape($) {
    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[name='twitter:title']").attr("content");

    $("h4").each((i, el) => {
      if ($(el).text() === "Ingredients" || $(el).text() === "Description") {
        $(el).nextAll("ul").each((i, ul) => {
          $(ul).find("li").each((i, li) => {
            ingredients.push($(li).text());
          })
        })
      }

      if ($(el).text() === "Directions") {
        $(el).nextAll("ol").each((i, ol) => {
          $(ol).find("li").each((i, li) => {
            instructions.push($(li).text());
          })
        })
      }
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

module.exports = MaangchiScraper;
