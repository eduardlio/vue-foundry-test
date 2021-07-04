const { Router } = require('express')
const dbClient = require('../db')
const { NotFoundError, BadRequestError } = require('../utils/errors')
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
  try {
    const employee = await dbClient.getByID(TABLE_NAME, id)
    res.json(employee)
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
  const name = req.body.name
  if(!name) {
    res.status(400).json(new BadRequestError())
    return;
  }
  try {
    const createdId = await dbClient.createOne(TABLE_NAME, { name })
    res.json({
      id: createdId,
      name
    })
  } catch(err) {
    res.json(new BadRequestError(err))
  }

})

router.put('/:id', async(req, res) => {
  const id = req.params.id;
  const updates = req.body
  try{
    const result = await dbClient.updateOne(TABLE_NAME, id, updates)
    console.log(result)
    res.json({ updated: id })
  } catch(err) {
    res.json(new BadRequestError(err))
  }
})


module.exports = (app) => {
  app.use('/employees', router)
}
