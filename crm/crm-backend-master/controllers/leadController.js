import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const { name, email, source } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const lead = await Lead.create({ name: name.trim(), email: email.trim(), source });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create lead" });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch leads" });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update lead" });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete lead" });
  }
};

export const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (!req.body.text?.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    lead.notes.push({ text: req.body.text.trim() });
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add note" });
  }
};
