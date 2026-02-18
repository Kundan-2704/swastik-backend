const HomeCategory = require("../model/HomeCategory");


class HomeCategoryService {
    async getAllHomeCategories() {
        return await HomeCategory.find().lean();
    }

    async createHomeCategory(homeCategory) {
        return await HomeCategory.create(homeCategory);
    }

    

    async createCategories(homeCategories) {

  if (!Array.isArray(homeCategories) || homeCategories.length === 0) {
    throw new Error("homeCategories must be a non-empty array");
  }

  const existingCategories = await HomeCategory.find().lean();

  // Agar already hai → same data return
  if (existingCategories.length > 0) {
    return existingCategories;
  }


  // Insert only once
  return await HomeCategory.insertMany(homeCategories);
}



    async updateHomeCategory(category, id) {
        const existingCategory = await HomeCategory.findById(id).lean();

        if (!existingCategory) {
            throw new Error("Category not found")
        }
        return await HomeCategory.findByIdAndUpdate(
            existingCategory._id,
            category,
            { new: true }
        )
        .lean();
    }

}

module.exports = new HomeCategoryService();