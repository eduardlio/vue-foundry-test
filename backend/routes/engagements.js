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
  try {
    const engagement = await dbClient.getByID(TABLE_NAME, id)
    res.json(engagement)
  } catch(err) {
    switch(err.code){
      case 404:
        res.status(404).json(err)
        break;
      default:
        res.status(400).json(err)
        break;
    }
  }
})

router.post('/', async(req, res) => {
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
    const startDate = new Date().toISOString()
    const createdId = await dbClient.createOne(TABLE_NAME, {
      name,
      client,
      employee,
      started: startDate,
      description: description || ''
    })
    res.json({
      id: createdId,
      name,
      client,
      employee,
      started: startDate,
      description
    })
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
  try {
    if(updates.id
      || updates.client
      || updates.employee
      || updates.started
      || updates.ended){
      throw new BadRequestException("Only name and description are editable fields")
    }
    await dbClient.updateOne(TABLE_NAME, id, updates)
    res.json({ updated: id })
  } catch(err) {
    switch(err.code){
      case 404:
        res.status(404).json(err)
        break;
      default:
        res.status(400).json(err)
        break;
    }
  }
})

module.exports = (app) => {
  app.use('/engagements', router)
}
