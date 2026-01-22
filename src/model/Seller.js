const mongoose = require("mongoose");
const UserRoles = require("../domain/userRole");
const AccountStatus = require("../domain/AccountStatus");

/* ===================== SELLER SCHEMA ===================== */

const sellerSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: Number,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔒 never return password
    },

    /* 🔥 ADD BELOW EXISTING FIELDS */

provider: {
  type: String,
  enum: ["email", "google"],
  default: "email",
},

googleUid: {
  type: String,
},

isVerified: {
  type: Boolean,
  default: false,
},


    /* BUSINESS DETAILS */
    businessDetails: {
      businessName: String,
      businessType: String,
      businessEmail: String,
      businessMobile: String,
      businessAddress: String,
    },

    /* BANK DETAILS */
    bankDetails: {
      accountNumber: String,
      accountHolderName: String,
      bankName: String,
      ifscCode: String,
      branchName: String,
    },

    /* PAN DETAILS */
    panDetails: {
      panNumber: {
        type: String,
        uppercase: true,
        trim: true,
      },
      panHolderName: {
        type: String,
        trim: true,
      },
    },

    /* PICKUP ADDRESS (REFERENCE) */
    pickupAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    /* GST */
    GSTIN: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    /* ROLE */
    role: {
      type: String,
      enum: [UserRoles.SELLER],
      default: UserRoles.SELLER,
    },

    /* ACCOUNT STATUS */
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING_VERIFICATION,
    },
  },
  {
    timestamps: true,
  }
);

/* ===================== SAFE EXPORT ===================== */

module.exports =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
