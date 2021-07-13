const { Router } = require('express')

const { BadRequestError } = require('../utils/errors')

const router = Router()
const { employeeService } = require('../controller')

router.get('/', (req, res) => {
  res.json(employeeService.getAll())
})

router.get('/:id/engagements', (req, res) => {
  const id = req.params.id;
  res.json(employeeService.getEngagements(id))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.json(employeeService.getOne(id))
})

router.post('/', (req, res) => {
  const name = req.body.name

  if(!name) {
    res.status(400).json(new BadRequestError())
    return;
  }

  res.json(employeeService.create(name))

})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body

  res.json(employeeService.update(id, updates.name))

})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.json(employeeService.delete(id))
})

module.exports = (app) => {
  app.use('/employees', router)
}
