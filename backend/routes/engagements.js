const { Router } = require('express')
const dbClient = require('../db')
const { BadRequestError } = require('../utils/errors')
const router = Router()

const TABLE_NAME = 'engagements'

router.get('/', async (req, res) => {
  const all = await dbClient.getAll(TABLE_NAME)
  res.json(all)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const client = await dbClient.getByID(TABLE_NAME, id)
  res.json(client)
})

router.post('/start', async(req, res) => {
  const {
    name,
    client,
    employee,
    description
  } = req.body
  if(!name || !client || !employee) {
    res.status(400).json(new BadRequestError())
    return;
  }
  try {
    const created = await dbClient.createOne(TABLE_NAME, {
      name,
      client,
      employee,
      started: new Date().toISOString(),
      description: description || ''
    })
    res.json({ created})
  } catch(err) {
    res.json(new BadRequestError(err))
  }
})
router.put('/:id/end', async(req, res) => {
  const { id }  = req.params;

  try {
    const existing = await dbClient.getByID(TABLE_NAME, id)
    if(!!existing.ended) {
      res.json({ updated: id });
    } else {
      await dbClient.updateOne(TABLE_NAME, id, {
        ended: new Date().toISOString()
      })
      res.json({ updated: id })
    }
  } catch (err) {
    res.json(new BadRequestError(err))
  }

})

router.put('/:id', async(req, res) => {
  const id = req.params.id;
  const updates = req.body
  try{
    await dbClient.updateOne(TABLE_NAME, id, updates)
    res.json({ updated: id })
  } catch(err) {
    res.json(new BadRequestError(err))
  }
})

module.exports = (app) => {
  app.use('/engagements', router)
}