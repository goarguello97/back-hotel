import User from "../models/User.js";

class UserControllers {
  static async getUsers(req, res) {
    try {
      const users = await User.find();
      if (!users) throw new Error("Users not found");
      return res.status(200).json({ status: "ok", users });
    } catch (error) {
      return res.status(400).json({ status: "failed", message: error.message });
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return res.status(200).json({ status: "ok", user });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async addUser(req, res) {
    const { name, email, password } = req.body;
    try {
      if (!name) throw new Error("Name is required.");
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");
      const user = await User.findOne({ email });
      if (user) throw new Error("Email is already in use.");
      const createdUser = await User.create({ name, email, password });
      return res.status(200).json({ status: "ok", user: { name, email } });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async updateUser(req, res) {
    const { body } = req;
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      const updatedUser = await User.findByIdAndUpdate(id, body, {
        new: true,
      });
      return res.status(200).json({ status: "ok", user: updatedUser });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      const userDeleted = await User.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ status: "ok", message: "User deleted succesfully" });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }
}

export default UserControllers;
