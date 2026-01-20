const HomeCategory = require("../model/HomeCategory");


class HomeCategoryService {
    async getAllHomeCategories() {
        return await HomeCategory.find();
    }

    async createHomeCategory(homeCategory) {
        return await HomeCategory.create(homeCategory);
    }

    // async createCategories(homeCategories) {
    //     const existingCategories = await HomeCategory.find();

    //     if (existingCategories.length == 0) {
    //         return await HomeCategory.insertMany(homeCategories);
    //     }
    //     return existingCategories;
    // }

    async createCategories(homeCategories) {

  if (!Array.isArray(homeCategories) || homeCategories.length === 0) {
    throw new Error("homeCategories must be a non-empty array");
  }

  const existingCategories = await HomeCategory.find();

  // Agar already hai → same data return
  if (existingCategories.length > 0) {
    return existingCategories;
  }

  console.log("INSERTING 👉", homeCategories.length);

  // Insert only once
  return await HomeCategory.insertMany(homeCategories);
}



    async updateHomeCategory(category, id) {
        const existingCategory = await HomeCategory.findById(id);

        if (!existingCategory) {
            throw new Error("Category not found")
        }
        return await HomeCategory.findByIdAndUpdate(
            existingCategory._id,
            category,
            { new: true }
        )
    }

}

module.exports = new HomeCategoryService();