"use strict";

const BaseScraper = require("../helpers/BaseScraper");

class DefaultDomainScraper extends BaseScraper {
  constructor(url) {
    super(url, url);
  }

  scrape($) {
    console.log("TRIGGERING DEFAULT DOMAIN SCRAPER!")

    this.defaultSetImage($);
    const { ingredients, instructions, time } = this.recipe;
    this.recipe.name = $("meta[property='og:title']").attr("content");

    var obj = $("script[type='application/ld+json']"); 

    for(var i in obj){
        for(var j in obj[i].children){
            var data = obj[i].children[j].data;
            if(data){
                const ingr = data.recipeIngredient;
                ingr.forEach(e => {
                    ingredients.push(e);
                })
            }
        }
    }

    // const scriptRaw = $("script[type='application/ld+json']").get()[0].children[0].data;

    // const scriptData = JSON.parse(scriptRaw)
    // const ingr = scriptData.recipeIngredient;

    // ingr.forEach(e => {
    //     ingredients.push(e);
    // })

     // check if it is a tasty recipes plug in, and follow structure if yes.
     if ($('.tasty-recipes').length > 0) {
        if (ingredients.length === 0) { 
            $(".tasty-recipes-ingredients")
            .find("li")
            .each((i, el) => {
                ingredients.push($(el).text());
            });
        }

      if (ingredients.length == 0) {
          $(".tasty-recipe-ingredients")
          .find("li")
          .each((i, el) => {
            ingredients.push($(el).text());
          });
      }

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

    time.prep = $(".tasty-recipes-prep-time").text();
    time.cook = $(".tasty-recipes-cook-time").text();
    time.total = $(".tasty-recipes-total-time").text();

    $(".tasty-recipes-yield-scale").remove();
    this.recipe.servings = $(".tasty-recipes-yield")
      .text()
      .trim();
  }

  // check if it is a wprm recipe
  else if ($('.wprm-recipe').length > 0) {
      if (!this.recipe.name) {
          this.recipe.name = $(".wprm-recipe-name").text();
      }


      if (ingredients.length === 0) { 
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
    }

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

      if (ingredients.length === 0) { 
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
        }

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

    if (ingredients.length === 0) { 
        $(".ERSIngredients").find(".ingredient")
        .each((i, el) => {
                var text = 
                $(el)
                    .text()
                    .replace(/\s\s+/g, " ")
                    .trim()
                    
                    ingredients.push(text);
            });
        }

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

  if (ingredients.length === 0) {
    $( "[class*='ngredient']" ).not('div').not('span').not(":header").each((i, el) => {
        ingredients.push($(el).text());
    });

    if (ingredients.length === 0) {
        $( "[itemProp*='ngredient']" ).not('div').not('span').not(":header").each((i, el) => {
            ingredients.push($(el).text());
        });

        if (ingredients.length === 0) {
            // search for header that is ingredients
            // var domType = $(":header, :contains('ngredient')").next().prop("nodeName");
            // console.log("DOM TYPE: ", domType)
            // $(":header, :contains('ngredient')").nextAll().each((i, el) => {
            //     ingredients.push($(el).text());
            // });

            if (ingredients.length === 0) {
                ingredients.push("No ingredients found")
                this.recipe.defaultFlag = true;
            }
        }
    }

  }

  console.log("here is resulting default domain scraper: ", this.recipe)
  }
}

module.exports = DefaultDomainScraper;
