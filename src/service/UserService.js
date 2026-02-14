const User = require("../model/User");
const jwtProvider = require("../util/jwtProvider");


class UserService {


    async findUserProfileByJwt(jwt) {
        const email = jwtProvider.getEmailFromjwt(jwt)

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User does not exist with email ${email}`)
        }
        return user
    }


    
 async createUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User({
      fullName: userData.fullName,
      email: userData.email,
      provider: userData.provider,
      googleUid: userData.googleUid,
      role: userData.role,
      isVerified: true,
    });

    return await user.save();
  }

 async findUserByEmail(email){
  return await User.findOne({ email }); // null return hone do
}


}

module.exports = new UserService()