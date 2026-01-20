const UserRoles = require("../domain/userRole");
const AuthService = require("../service/AuthService");

class authController {
    async sendLoginOtp(req, res) {
        try {
            const email = req.body.email
            await AuthService.sendLoginOtp(email)

            res.status(200).json({ message: "otp send successfully" });
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }


    async createUser(req, res) {
        try {
            const jwt = await AuthService.createUser(req.body)

            const authRes = {
                jwt,
                message: "User Created Successfully",
                role: UserRoles.CUSTOMER
            }

            res.status(200).json(authRes);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }


    async signin(req, res) {
        try {
            const authRes = await AuthService.signin(req.body)

            res.status(200).json(authRes);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }



}

module.exports = new authController();

