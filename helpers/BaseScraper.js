"use strict";

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { validate } = require("jsonschema");
const { ProxyCrawlAPI } = require('proxycrawl');
const Recipe = require("./Recipe");
const recipeSchema = require("./RecipeSchema.json");
const api = new ProxyCrawlAPI({ token: 'JzJPU2LgIa2GRXeCi1O4sw' });

/**
 * Abstract Class which all scrapers inherit from
 */
class BaseScraper {
  constructor(url, subUrl = "") {
    this.url = url;
    this.subUrl = subUrl;
  }

  /**
   * Checks if the url has the required sub url
   */
  checkUrl() {
    if (!this.url.includes(this.subUrl)) {
      throw new Error(`url provided must include '${this.subUrl}'`);
    }
  }

  /**
   * Builds a new instance of Recipe
   */
  createRecipeObject() {
    this.recipe = new Recipe();
  }

  defaultError(rec) {
    throw new Error("No recipe found on page", rec);
  }

  cheerioCatchError() {
    throw new Error("Cheerio Catch Error");
  }

  /**
   * @param {object} $ - a cheerio object representing a DOM
   * @returns {string|null} - if found, an image url
   */
  defaultSetImage($) {
    this.recipe.image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='og:image']").attr("content") ||
      $("meta[itemprop='image']").attr("content");
  }

  /**
   * Fetches html from url
   * @returns {object} - Cheerio instance
   */
  async fetchDOMModel() {
    try { 
      // const res = await fetch(this.url);
      // const html = await res.text();
      //   const res = await api.get(this.url).then(response => {
      //   // Make sure the response is success
      //   if (response.statusCode === 200) {
      //     const html = response.body;
      //     const load = cheerio.load(html);
      //     console.log("here is cheerio.load ", load);
      //     return load;
      //   } else {
      //     console.log('Proxy Crawl get Failed: ', response.statusCode, response.originalStatus);
      //   }
      // });

      const res = await api.get(this.url);
      const html = await res.body;
      const load = cheerio.load(html);
      return load;
 
    } catch (err) {
      console.log("here is error ", err);
      this.cheerioCatchError();
    }
  }

  /**
   * Handles the workflow for fetching a recipe
   * @returns {object} - an object representing the recipe
   */
  async fetchRecipe(scrapeFlag, jquery) {
    this.checkUrl();
    var $;
    if (scrapeFlag) {
      console.log("sourceData identified, using jquery object")
      $ = jquery;
    }
    else {
      console.log("no sourceData, must fetch Dom Model")
      $ = await this.fetchDOMModel();
    }
    this.createRecipeObject();
    this.scrape($);
    return this.validateRecipe();
  }

  /**
   * Abstract method
   * @param {object} $ - cheerio instance
   * @returns {object} - an object representing the recipe
   */
  scrape($) {
    throw new Error("scrape is not defined in BaseScraper");
  }

  textTrim(el) {
    return el.text().trim();
  }

  /**
   * Validates scraped recipes against defined recipe schema
   * @returns {object} - an object representing the recipe
   */
  validateRecipe() {
    // let res = validate(this.recipe, recipeSchema);
    // if (!res.valid) {
    //   this.defaultError(this.recipe);
    // }

    if (!this.recipe.name) {
      this.defaultError(this.recipe);
    }
    return this.recipe;
  }
}

module.exports = BaseScraper;
