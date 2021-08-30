class Recipe {
  constructor() {
    this.name = "";
    this.ingredients = [];
    this.instructions = [];
    this.tags = [];
    this.time = {
      prep: "",
      cook: "",
      active: "",
      inactive: "",
      ready: "",
      total: ""
    };
    this.servings = "";
    this.image = "";
    this.sourceData = "";
  }
}

module.exports = Recipe;
