// const Address = require("../model/Address");
// const Seller = require("../model/Seller");
// const jwtProvider = require("../util/jwtProvider");

// class SellerService {

//   /* ================= CREATE SELLER ================= */
// async createSeller(sellerData) {

//   const existingSeller = await Seller.findOne({
//     $or: [
//       { email: sellerData.email },
//       { mobile: sellerData.mobile }
//     ]
//   });

//   if (existingSeller) {
//     throw new Error("Seller already registered");
//   }

//   // 1️⃣ Create Seller FIRST
//   const seller = new Seller({
//     sellerName: sellerData.sellerName,
//     email: sellerData.email,
//     password: sellerData.password,
//     mobile: sellerData.mobile,
//     GSTIN: sellerData.GSTIN,
//     bankDetails: sellerData.bankDetails,
//     businessDetails: sellerData.businessDetails,
//   });

//   const savedSeller = await seller.save();

//   // 2️⃣ Create Address AFTER seller exists
//   let savedAddress = null;

//   if (sellerData.pickupAddress) {
//     savedAddress = await Address.create({
//       user: savedSeller._id,                          // ✅ REQUIRED
//       name: sellerData.pickupAddress.name 
//             || sellerData.sellerName,                 // ✅ REQUIRED
//       mobile: sellerData.pickupAddress.mobile 
//               || sellerData.mobile,                   // ✅ REQUIRED
//       address: sellerData.pickupAddress.address,      // ✅ REQUIRED
//       locality: sellerData.pickupAddress.locality 
//                 || "NA",                              // ✅ REQUIRED
//       city: sellerData.pickupAddress.city,
//       state: sellerData.pickupAddress.state,
//       pinCode: sellerData.pickupAddress.pinCode 
//                || sellerData.pickupAddress.pincode,   // ✅ REQUIRED
//     });

//     // 3️⃣ Link address to seller
//     savedSeller.pickupAddress = savedAddress._id;
//     await savedSeller.save();
//   }

//   return savedSeller;
// }


//   /* ================= PROFILE ================= */

//   async getSellerProfile(jwt) {
//     const email = jwtProvider.getEmailFromjwt(jwt);
//     return this.getSellerByEmail(email);
//   }

//   async getSellerByEmail(email) {
//     const seller = await Seller
//       .findOne({ email })
//       .populate("pickupAddress");

//     if (!seller) {
//       throw new Error("Seller not found");
//     }
//     return seller;
//   }

//   async getSellerById(id) {
//     const seller = await Seller
//       .findById(id)
//       .populate("pickupAddress");

//     if (!seller) {
//       throw new Error("Seller not found");
//     }
//     return seller;
//   }

//   /* ================= LIST ================= */

//   async getAllSeller(status) {
//     const filter = {};
//     if (status) {
//       filter.accountStatus = status;
//     }

//     return await Seller
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .populate("pickupAddress");
//   }

//   /* ================= UPDATE SELLER ================= */

//   // async updateSeller(existingSeller, sellerData) {

//   //   let addressId = existingSeller.pickupAddress;

//   //   // ✅ If frontend sends pickupAddress object
//   //   if (sellerData.pickupAddress) {

//   //     if (existingSeller.pickupAddress) {
//   //       // update existing address
//   //       await Address.findByIdAndUpdate(
//   //         existingSeller.pickupAddress,
//   //         sellerData.pickupAddress,
//   //         { new: true }
//   //       );
//   //     } else {
//   //       // create new address
//   //       const newAddress = await Address.create(sellerData.pickupAddress);
//   //       addressId = newAddress._id;
//   //     }
//   //   }

//   //   const updatePayload = {
//   //     sellerName: sellerData.sellerName,
//   //     email: sellerData.email,
//   //     mobile: sellerData.mobile,
//   //     GSTIN: sellerData.GSTIN,
//   //     bankDetails: sellerData.bankDetails,
//   //     businessDetails: sellerData.businessDetails,
//   //     pickupAddress: addressId,
//   //   };

//   //   return await Seller.findByIdAndUpdate(
//   //     existingSeller._id,
//   //     updatePayload,
//   //     { new: true }
//   //   ).populate("pickupAddress");
//   // }

//   async updateSeller(existingSeller, sellerData) {

//   let addressId = existingSeller.pickupAddress;

//   if (sellerData.pickupAddress) {

//     const addressPayload = {
//       ...sellerData.pickupAddress,
//       user: existingSeller._id,   // ✅ REQUIRED FIX
//     };

//     if (existingSeller.pickupAddress) {
//       await Address.findByIdAndUpdate(
//         existingSeller.pickupAddress,
//         addressPayload,
//         { new: true }
//       );
//     } else {
//       const newAddress = await Address.create(addressPayload);
//       addressId = newAddress._id;
//     }
//   }

//   const updatePayload = {
//     sellerName: sellerData.sellerName,
//     email: sellerData.email,
//     mobile: sellerData.mobile,
//     GSTIN: sellerData.GSTIN,
//     bankDetails: sellerData.bankDetails,
//     businessDetails: sellerData.businessDetails,
//     panDetails: sellerData.panDetails,
//     pickupAddress: addressId,   // ✅ FIXED NAME
//   };

//   return await Seller.findByIdAndUpdate(
//     existingSeller._id,
//     updatePayload,
//     { new: true }
//   ).populate("pickupAddress");
// }


//   /* ================= STATUS ================= */

//   async updateSellerStatus(sellerId, status) {
//     return await Seller.findByIdAndUpdate(
//       sellerId,
//       { $set: { accountStatus: status } },
//       { new: true }
//     );
//   }

//   /* ================= DELETE ================= */

//   async deleteSeller(sellerId) {
//     return await Seller.findByIdAndDelete(sellerId);
//   }
// }

// module.exports = new SellerService();





const Address = require("../model/Address");
const Seller = require("../model/Seller");
const jwtProvider = require("../util/jwtProvider");

class SellerService {

  /* ================= CREATE SELLER ================= */
  async createSeller(sellerData) {
    const existingSeller = await Seller.findOne({
      $or: [{ email: sellerData.email }, { mobile: sellerData.mobile }],
    });

    if (existingSeller) {
      throw new Error("Seller already registered");
    }

    /* 1️⃣ CREATE SELLER */
    const seller = new Seller({
      sellerName: sellerData.sellerName,
      email: sellerData.email,
      password: sellerData.password,
      mobile: sellerData.mobile,
      GSTIN: sellerData.GSTIN,
      bankDetails: sellerData.bankDetails,
      businessDetails: sellerData.businessDetails,
      panDetails: sellerData.panDetails,
    });

    const savedSeller = await seller.save();

    /* 2️⃣ CREATE PICKUP ADDRESS (OPTIONAL) */
    if (sellerData.pickupAddress) {
      const address = await Address.create({
        user: savedSeller._id, // ✅ REQUIRED
        name: sellerData.pickupAddress.name || savedSeller.sellerName,
        mobile: sellerData.pickupAddress.mobile || savedSeller.mobile,
        address: sellerData.pickupAddress.address,
        locality: sellerData.pickupAddress.locality || "NA",
        city: sellerData.pickupAddress.city,
        state: sellerData.pickupAddress.state,
        pinCode:
          sellerData.pickupAddress.pinCode ||
          sellerData.pickupAddress.pincode,
      });

      savedSeller.pickupAddress = address._id;
      await savedSeller.save();
    }

    return await Seller.findById(savedSeller._id).populate("pickupAddress");
  }

  /* ================= PROFILE ================= */

  async getSellerProfile(jwt) {
    const email = jwtProvider.getEmailFromjwt(jwt);
    return this.getSellerByEmail(email);
  }

  // async getSellerByEmail(email) {
  //   const seller = await Seller.findOne({ email }).populate("pickupAddress");

  //   if (!seller) {
  //     throw new Error("Seller not found");
  //   }
  //   return seller;
  // }

  async getSellerByEmail(email) {
  return await Seller.findOne({ email }).populate("pickupAddress");
}


  async getSellerById(id) {
    const seller = await Seller.findById(id).populate("pickupAddress");

    if (!seller) {
      throw new Error("Seller not found");
    }
    return seller;
  }

  /* ================= LIST ================= */

  async getAllSeller(status) {
    const filter = {};
    if (status) filter.accountStatus = status;

    return await Seller.find(filter)
      .sort({ createdAt: -1 })
      .populate("pickupAddress");
  }

  /* ================= UPDATE SELLER ================= */

  async updateSeller(existingSeller, sellerData) {
    let addressId = existingSeller.pickupAddress;

    /* 🔥 HANDLE PICKUP ADDRESS */
    if (sellerData.pickupAddress) {
      const addressPayload = {
        user: existingSeller._id, // ✅ REQUIRED
        name: sellerData.pickupAddress.name || existingSeller.sellerName,
        mobile:
          sellerData.pickupAddress.mobile || existingSeller.mobile,
        address: sellerData.pickupAddress.address,
        locality: sellerData.pickupAddress.locality || "NA",
        city: sellerData.pickupAddress.city,
        state: sellerData.pickupAddress.state,
        pinCode:
          sellerData.pickupAddress.pinCode ||
          sellerData.pickupAddress.pincode,
      };

      if (existingSeller.pickupAddress) {
        await Address.findByIdAndUpdate(
          existingSeller.pickupAddress,
          addressPayload,
          { new: true, runValidators: true }
        );
      } else {
        const newAddress = await Address.create(addressPayload);
        addressId = newAddress._id;
      }
    }

    /* 🔥 UPDATE SELLER */
    const updatePayload = {
      sellerName: sellerData.sellerName,
      email: sellerData.email,
      mobile: sellerData.mobile,
      GSTIN: sellerData.GSTIN,
      bankDetails: sellerData.bankDetails,
      businessDetails: sellerData.businessDetails,
      panDetails: sellerData.panDetails,
      pickupAddress: addressId,
    };

    return await Seller.findByIdAndUpdate(
      existingSeller._id,
      updatePayload,
      { new: true, runValidators: true }
    ).populate("pickupAddress");
  }

  /* ================= STATUS ================= */

  async updateSellerStatus(sellerId, status) {
    return await Seller.findByIdAndUpdate(
      sellerId,
      { accountStatus: status },
      { new: true }
    );
  }

  /* ================= DELETE ================= */

  async deleteSeller(sellerId) {
    return await Seller.findByIdAndDelete(sellerId);
  }
}

module.exports = new SellerService();
