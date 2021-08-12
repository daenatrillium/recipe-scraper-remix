"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class DefaultDomainScraper extends BaseScraper {
  constructor(url) {
    super(url, url);
  }

  scrape($) {
    console.log("TRIGGERING DEFAULT DOMAIN SCRAPER!")

    this.defaultSetImage($);

    // New comment here
    let cool = 0;
    let { ingredients, instructions, time } = this.recipe;

     if ($('.tasty-recipes').length > 0) {
            $(".tasty-recipes-ingredients")
            .find("li")
            .each((i, el) => {
                ingredients.push($(el).text());
            });

      $(".tasty-recipes-instructions")
      .find("li")
      .each((i, el) => {
        instructions.push($(el).text());
      });

      if (instructions.length == 0) {
          $(".tasty-recipe-instructions")
          .find("li")
          .each((i, el) => {
            instructions.push($(el).text());
          });
      }

    this.recipe.name = $("meta[property='og:title']").attr("content");
    time.prep = $(".tasty-recipes-prep-time").text();
    time.cook = $(".tasty-recipes-cook-time").text();
    time.total = $(".tasty-recipes-total-time").text();

    $(".tasty-recipes-yield-scale").remove();
    this.recipe.servings = $(".tasty-recipes-yield")
      .text()
      .trim();
  }

  // check if it is a wprm recipe

  else if ($('.wprm-recipe').length > 0 || $( "[class*='wprm-']" ).length > 0 || $('.wprm-recipe-name').length > 0) {
    console.log("HIT WPRM RECIPE SCRAPER");
    if (!this.recipe.name) {
          this.recipe.name = $(".wprm-recipe-name").text();
      }


          $(".wprm-recipe-ingredient-group").each((i, el) => {
          $(el)
          .find(".wprm-recipe-ingredient")
          .each((i, el) => {
              ingredients.push(
              $(el)
                  .text()
                  .replace(/\s\s+/g, " ")
                  .trim()
              );
          });
      });


      $(".wprm-recipe-instruction-group").each((i, el) => {
          instructions.push(
          $(el)
              .children(".wprm-recipe-group-name")
              .text()
          );
          $(el)
          .find(".wprm-recipe-instruction-text")
          .each((i, elChild) => {
              instructions.push($(elChild).text());
          });
      });

      $(".wprm-recipe-time-container").each((i, el) => {
          let label = $(el)
          .children(".wprm-recipe-time-label")
          .text().toLowerCase();

          if (!label) {
              console.log("FOUND A BLANK LABEL, CHECKING NEW LABEL")
              label = $(el)
              .children(".wprm-recipe-time-header")
              .text();
              console.log("HERE IS LABEL: ", label)
          }

          let recipeTime = $(el)
          .children(".wprm-recipe-time")
          .text()
          
          if (recipeTime) {
              if (label.includes("prep")) {
              time.prep = recipeTime;
              } else if (label.includes("cook")) {
              time.cook = recipeTime;
              } else if (label.includes("resting")) {
              time.inactive = recipeTime;
              } else if (label.includes("inactive")) {
                  time.inactive = recipeTime;
              } else if (label.includes("total")) {
                  time.total = recipeTime;
              }
          }
      });

      this.recipe.servings = $(".wprm-recipe-servings").text().trim();
      if(!this.recipe.servings) {
          this.recipe.servings = $(".wprm-recipe-servings-with-unit")
          .text()
          .trim();
      }
  }

  // check if it is mv
  else if ($('.mv-create-ingredients').length > 0) {

      if (!this.recipe.name) {
          this.recipe.name = $(".mv-create-title").text();
      }

          $(".mv-create-ingredients").find("li")
            .each((i, el) => {
                var text = 
                $(el)
                    .text()
                    .replace(/\s\s+/g, " ")
                    .trim()
                if (text && text.toLowerCase() !== "ingredients") {
                    console.log("PUSHING THIS TEXT FOR INGREDIENTS: ", text)
                    ingredients.push(text);
                }
            });
        

      $(".mv-create-instructions").find("li")
      .each((i, el) => {
              var text = 
              $(el)
                  .text()
                  .replace(/\s\s+/g, " ")
                  .trim()
              if (text && text.toLowerCase() !== "instructions") {
                  console.log("PUSHING THIS TEXT FOR INSTRUCTIONS: ", text)
                  instructions.push(text);
              }
          });
      let prep = $(".mv-create-time-prep").text()
      time.prep = prep ? prep.match(/\d+/)[0] : ""

      let active =  $(".mv-create-time-active").text()
      time.active = active ? active.match(/\d+/)[0] : ""

      let inactive =  $(".mv-create-time-additional").text()
      time.inactive = inactive ? inactive.match(/\d+/)[0] : ""
      
      let total =  $(".mv-create-time-total").text()
      time.total = total ? total.match(/\d+/)[0] : ""

      let servings = $(".mv-create-nutrition-yield").text().trim().toLowerCase();
      this.recipe.servings = servings.replace(":","").replace("yield", "").replace("servings", "").trim()

  }

// check if it is ERS
else if ($('.ERSIngredients').length > 0) {

    if (!this.recipe.name) {
        this.recipe.name = $(".ERSName").text();
    }

        $(".ERSIngredients").find(".ingredient")
        .each((i, el) => {
                var text = 
                $(el)
                    .text()
                    .replace(/\s\s+/g, " ")
                    .trim()
                    
                    ingredients.push(text);
            });
        

    $(".ERSInstructions").find(".instruction")
    .each((i, el) => {
            var text = 
            $(el)
                .text()
                .replace(/\s\s+/g, " ")
                .trim()

                instructions.push(text);
        });

    time.prep = $("*[itemprop = 'prepTime']").text()? $("*[itemprop = 'prepTime']").text() : ""

    time.active = $("*[itemprop = 'cookTime']").text() ? $("*[itemprop = 'cookTime']").text() : ""
    
    time.total = $("*[itemprop = 'totalTime']").text() ? $("*[itemprop = 'totalTime']").text() : ""

    this.recipe.servings = $("*[itemprop = 'recipeYield']").text() ? $("*[itemprop = 'recipeYield']").text() : ""
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

  if(ingredients.length ===0) {
    $( "[itemProp*='ngredient']" ).not('div').not('span').not(":header").each((i, el) => {
        ingredients.push($(el).text());
    });
  

    if (ingredients.length === 0) {
        $( "[class*='ngredient']" ).not('div').not('span').not(":header").each((i, el) => {
            ingredients.push($(el).text());
        });

        if (ingredients.length === 0) {
            console.log("HIT LD+JSON SCRAPER");
            const scriptText = $("script[type='application/ld+json']").html();
            if (scriptText) {
                try {
                    const scriptData = JSON.parse(scriptText);
                    if (scriptData) {
                        const ingr = scriptData.recipeIngredient;
                        if (ingr) {
                            ingr.forEach(e => {
                                ingredients.push(e);
                            })
                        }
                    }
                } catch (error) {
                    console.log("NOT a JSON string!!")
                }
                finally {
                    if (ingredients.length === 0) {
                        ingredients.push("No ingredients found")
                        this.recipe.defaultFlag = true;
                    }
                }
            }
            // search for header that is ingredients
            // var domType = $(":header, :contains('ngredient')").next().prop("nodeName");
            // console.log("DOM TYPE: ", domType)
            // $(":header, :contains('ngredient')").nextAll().each((i, el) => {
            //     ingredients.push($(el).text());
            // });
        
        }
    }
}



  console.log("here is resulting default domain scraper: ", this.recipe)
  }
}

module.exports = DefaultDomainScraper;
