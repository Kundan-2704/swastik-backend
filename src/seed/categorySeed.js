const mongoose = require("mongoose");
const Category = require("../model/Category"); // path adjust kar lena

mongoose.connect(
    "mongodb+srv://rajendradewangan2712_db_user:iohJjcswbJcJiEN5@cluster0.imgaojp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

// 🔴 WARNING: ye sab delete karega
async function Categoryseed() {
    try {
        await Category.deleteMany({});
        console.log("🧹 Old categories removed");

        /* ================= LEVEL 1 ================= */

        const kosa = await Category.create({
            name: "Kosa Sarees",
            categoryId: "kosa_sarees",
            level: 1
        });

        const tussar = await Category.create({
            name: "Tussar Sarees",
            categoryId: "tussar_sarees",
            level: 1
        });

        const handloom = await Category.create({
            name: "Handloom Sarees",
            categoryId: "handloom_sarees",
            level: 1
        });

        const wedding = await Category.create({
            name: "Wedding Sarees",
            categoryId: "wedding_sarees",
            level: 1
        });

        const daily = await Category.create({
            name: "Daily Wear Sarees",
            categoryId: "daily_wear_sarees",
            level: 1
        });

        const printed = await Category.create({
            name: "Printed Sarees",
            categoryId: "printed_sarees",
            level: 1
        });

        /* ================= LEVEL 2 ================= */

        // KOSA
        const pureKosa = await Category.create({
            name: "Pure Kosa Silk",
            categoryId: "pure-kosa-silk",
            level: 2,
            parentCategory: kosa._id
        });

        await Category.create({
            name: "Kosa with Jamdani Work",
            categoryId: "kosa-jamdani",
            level: 2,
            parentCategory: kosa._id
        });

        // TUSSAR
        const tussarPrinted = await Category.create({
            name: "Tussar Printed Sarees",
            categoryId: "tussar-printed",
            level: 2,
            parentCategory: tussar._id
        });

        // HANDLOOM
        const pureHandloom = await Category.create({
            name: "Pure Handloom",
            categoryId: "pure_handloom",
            level: 2,
            parentCategory: handloom._id
        });

        // DAILY
        await Category.create({
            name: "Cotton Daily Wear",
            categoryId: "daily_cotton",
            level: 2,
            parentCategory: daily._id
        });

        // PRINTED
        const blockPrinted = await Category.create({
            name: "Block Printed Sarees",
            categoryId: "block_printed",
            level: 2,
            parentCategory: printed._id
        });

        /* ================= LEVEL 3 ================= */

        // KOSA → Pure
        await Category.create({
            name: "Soft Pure Kosa",
            categoryId: "kosa-soft-pure",
            level: 3,
            parentCategory: pureKosa._id
        });

        await Category.create({
            name: "Zari Work Kosa",
            categoryId: "kosa-zari-work",
            level: 3,
            parentCategory: pureKosa._id
        });

        // TUSSAR → Printed
        await Category.create({
            name: "Printed Tussar",
            categoryId: "tussar_printed_variants",
            level: 3,
            parentCategory: tussarPrinted._id
        });

        // HANDLOOM
        await Category.create({
            name: "Handloom Traditional",
            categoryId: "handloom_traditional",
            level: 3,
            parentCategory: pureHandloom._id
        });

        // PRINTED
        await Category.create({
            name: "Floral Block Print",
            categoryId: "floral_block_print",
            level: 3,
            parentCategory: blockPrinted._id
        });

        console.log("✅ Categories seeded successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

Categoryseed();
