const { Router } = require('express')

const { BadRequestError } = require('../utils/errors')

const router = Router()
const { clientService } = require('../controller')

router.get('/', (req, res) => {
  res.json(clientService.getAll())
})

router.get('/:id/engagements', (req, res) => {
  const id = req.params.id;
  res.json(clientService.getEngagements(id))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.json(clientService.getOne(id))
})

router.post('/', (req, res) => {
  const name = req.body.name

  if(!name) {
    res.status(400).json(new BadRequestError())
    return;
  }

  res.json(clientService.create(name))

})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body

  res.json(clientService.update(id, updates.name))

})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.json(clientService.delete(id))
})

module.exports = (app) => {
  app.use('/clients', router)
}
