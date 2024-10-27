import User from "../models/User.js";

class UserControllers {
  static async getUsers(req, res) {
    try {
      const users = await User.find();
      if (!users) throw new Error("Users not found");
      return res.status(200).json({ status: "ok", users });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "Failded", message: error.message });
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return res.status(200).json({ status: "ok", user });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "Failded", message: error.message });
    }
  }
}

export default UserControllers;
