// const { default: mongoose } = require("mongoose");
// const UserRoles = require("../domain/userRole");


// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true
//     },

//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },

//     password: {
//         type: String
//     },

//     mobile: {
//         type: String,
//     },

//     addresses: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Address"
//     },

//     role: {
//         type: String,
//         enum: [UserRoles.CUSTOMER, UserRoles.ADMIN],
//         default: UserRoles.CUSTOMER
//     },

// })

// const User = mongoose.model("User", userSchema);

// module.exports = User;


// const { default: mongoose } = require("mongoose");
// const UserRoles = require("../domain/userRole");

// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: false,       // ⬅️ no longer required
//         default: ""            // ⬅️ safe default
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String
//     },
//     mobile: {
//         type: String,
//     },
//     addresses: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Address"
//     },
//     role: {
//         type: String,
//         enum: [UserRoles.CUSTOMER, UserRoles.ADMIN],
//         default: UserRoles.CUSTOMER
//     },
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;






const { default: mongoose } = require("mongoose");
const UserRoles = require("../domain/userRole");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,
    default: ""
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  mobile: {
    type: String,
  },
  addresses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  },
  role: {
    type: String,
    enum: [UserRoles.CUSTOMER, UserRoles.ADMIN],
    default: UserRoles.CUSTOMER
  },

  /* 🔥 ADDED (SAFE) */
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
});

const User = mongoose.model("User", userSchema);
module.exports = User;
