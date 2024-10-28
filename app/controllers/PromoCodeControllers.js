import PromoCode from "../models/PromoCode.js";

class PromoCodeControllers {
  static async getPromos(req, res) {
    try {
      const promos = await PromoCode.find({});
      if (!promos) throw new Error("Promos not found");
      return res.status(200).json({ status: "ok", promos });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async getPromoById(req, res) {
    const { id } = req.params;
    try {
      const promo = await PromoCode.findById(id)
        .populate("user")
        .populate("offer");
      if (!promo) throw new Error("Promo not found");
      return res.status(200).json({ status: "ok", promo });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async addPromo(req, res) {
    const { user, offer } = req.body;
    try {
      if (!user) throw new Error("User is required");
      if (!offer) throw new Error("Offer is required");

      const createdPromo = await PromoCode.create({ user, offer });
      const promo = await PromoCode.findById(createdPromo._id)
        .populate("user")
        .populate("offer");
      return res.status(200).json({ status: "ok", promo });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }
}

export default PromoCodeControllers;
