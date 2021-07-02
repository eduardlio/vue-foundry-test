const { Router } = require('express')
const dbClient = require('../db')
const { BadRequestError } = require('../utils/errors')
const router = Router()

const TABLE_NAME = 'employees'

router.get('/', async (req, res) => {
  const all = await dbClient.getAll(TABLE_NAME)
  res.json(all)
})

router.get('/:id/engagements', async (req, res) => {
  const id = req.params.id;
  try{
    const engagements = await dbClient.all('select * from engagements where employee = :id', {
      ':id': id
    })
    res.json(engagements)
  } catch (err) {
    res.json(new BadRequestError(err))
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const client = await dbClient.getByID(TABLE_NAME, id)
  res.json(client)
})

router.post('/', async(req, res) => {
  const name = req.body.name
  if(!name) {
    res.status(400).json(new BadRequestError())
    return;
  }
  try {
    const created = await dbClient.createOne(TABLE_NAME, { name })
    res.json({created})
  } catch(err) {
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
  app.use('/employees', router)
}