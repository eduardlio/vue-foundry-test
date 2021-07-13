const { Router } = require('express')
const { BadRequestError, NotFoundError } = require('../utils/errors')
const router = Router()

const { engagementService } = require('../controller')

router.get('/', (req, res) => {
  res.json(engagementService.getAll())
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.json(engagementService.getOne(id))
})

router.post('/', (req, res) => {
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

  res.json(engagementService.create(name, client, employee, description))

})

router.put('/:id/end', (req, res) => {
  const { id }  = req.params;

  const ended = engagementService.end(id)
  if(!ended) {
    res.status(404).json(new NotFoundError())
    return;
  }
  res.json(ended)

})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body

  const updated = engagementService.update(id, updates.name, updates.description)
  if(!updated) {
    res.status(404).json(new NotFoundError())
    return;
  }
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.json(engagementService.delete(id))
})

module.exports = (app) => {
  app.use('/engagements', router)
}
