const CabType = require("../models/CabTypeModel");

const editCabTypeController = async (req, res) => {
  const updatedCabTypes = req.body;
  console.log(updatedCabTypes);
  //   const updatedCabTypes = JSON.parse(updatedCabTypesOld);
  //   console.log(updatedCabTypes);
  try {
    console.log(updatedCabTypes);
    const updatedCabTypePromises = updatedCabTypes.map(async (cabType) => {
      const updatedCabType = await CabType.findByIdAndUpdate(
        cabType.id,
        cabType,
        { new: true }
      );
      return updatedCabType;
    });

    const updatedCabTypeResults = await Promise.all(updatedCabTypePromises);
    res.json(updatedCabTypeResults);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = editCabTypeController;
