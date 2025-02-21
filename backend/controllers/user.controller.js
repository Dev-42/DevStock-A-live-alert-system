exports.getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};
