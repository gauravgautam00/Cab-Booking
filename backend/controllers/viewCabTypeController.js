const CabType = require("../models/CabTypeModel");

const getCabTypeOptions = async (req, res) => {
  try {
    const cabTypeOptions = await CabType.find();
    res.status(200).json({ cabTypeOptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getCabTypeOptions;
