


const HomeCategoryService = require("../service/HomeCategoryService");
const HomeService = require("../service/HomeService");
const HomeCategorySection = require("../domain/HomeCategorySection");
const apicache = require("apicache");

class HomeCategoryController {
  async createHomeCategories(req, res) {
    try {
      const homeCategories = req.body;

      if (!Array.isArray(homeCategories)) {
        return res.status(400).json({
          message: "homeCategories must be an array"
        });
      }


    
      const categories =
        await HomeCategoryService.createCategories(homeCategories);

      const home =
        await HomeService.createHomePageData(categories);

        apicache.clear();

      return res.status(201).json(home);

    } catch (error) {
      console.error("❌ createHomeCategories error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async getHomeCategory(req, res) {
    try {
      const categories =
        await HomeCategoryService.getAllHomeCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateHomeCategory(req, res) {
    try {
      const id = req.params.id;
      const homeCategory = req.body;
      const updateCategory =
        await HomeCategoryService.updateHomeCategory(homeCategory, id);

        apicache.clear();

      return res.status(200).json(updateCategory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new HomeCategoryController();
