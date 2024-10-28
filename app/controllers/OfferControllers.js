import Offer from "../models/Offer.js";

class OfferController {
  static async getOffers(req, res) {
    try {
      const offers = await Offer.find({});
      if (!offers) throw new Error("Offers not found");
      return res.status(200).json({ status: "ok", offers });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async getOfferById(req, res) {
    const { id } = req.params;
    try {
      const offer = await Offer.findById(id);
      if (!offer) throw new Error("Offer not found");
      return res.status(200).json({ status: "ok", offer });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async addOffer(req, res) {
    const { name, description } = req.body;
    try {
      if (!name) throw new Error("Name is required");
      if (!description) throw new Error("Description is required");
      const offer = await Offer.findOne({ name });
      if (offer) throw new Error("Offer already exists");
      const createdOffer = await Offer.create({ name, description });
      return res.status(200).json({ status: "ok", offer: createdOffer });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async updateOffer(req, res) {
    const { body } = req;
    const { id } = req.params;
    try {
      const offer = await Offer.findById(id);
      if (!offer) throw new Error("Offer not found");
      const updatedOffer = await Offer.findByIdAndUpdate(id, body, {
        new: true,
      });
      return res.status(200).json({ status: "ok", offer: updatedOffer });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }

  static async deleteOffer(req, res) {
    const { id } = req.params;
    try {
      const offer = await Offer.findById(id);
      if (!offer) throw new Error("Offer not found");
      const deletedOffer = await Offer.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ status: "ok", message: "Offer deleted succesfully" });
    } catch (error) {
      return res.status(404).json({ status: "failed", message: error.message });
    }
  }
}

export default OfferController;
