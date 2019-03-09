const Purchase = require('../models/Purchase')

class ApproveSaleController {
  async execute (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!ad.author.__id.equals(req.userId)) {
      return res.status(401).json({ error: 'Not author' })
    }

    if (ad.purchaseBy) {
      return res.status(400).json({
        error: 'Already purchased'
      })
    }

    ad.purchaseBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new ApproveSaleController()
