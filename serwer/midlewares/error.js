module.exports = function (err, req, res, next) {
  if (err instanceof Error) {
    return res.json({ message: err.message });
  }

  return res.json({ message: "Unknown error" });
};
