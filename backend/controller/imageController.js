exports.createImage = async (req, res) => {
  try {
    console.log(req.user)
    console.log(req.file)
    console.log(req.body)

    res.json({
      message: 'Image uploaded successfully',
      user: req.user,
      file: req.file,
      body: req.body
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}