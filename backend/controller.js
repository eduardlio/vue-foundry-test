const { v4 } = require('uuid')

class CRUDController {
  constructor() {
    this.rows = []
  }
  getOne(id) {
    return this.rows.find((item) => item.id === id)
  }
  getAll() {
    return this.rows
  }
  delete(id) {
    const target = this.getOne(id)
    if(!target) return;
    this.rows = this.rows
      .filter(item => item.id !== id)
    return { deleted: id }
  }

  create(name) {
    const created = {
      id: v4(),
      name
    }
    this.rows.push(created)
    return created
  }
  update(id, name) {
    const target = this.getOne(id)
    if(!target) return;
    this.rows = this.rows
      .map(item => {
        return item.id === id
          ? { ...item, name }
          : item
      })
    return { updated: id }
  }
}
class ClientEmployeeController extends CRUDController {
  constructor(engagementController, type) {
    super()
    this.engagementService = engagementController
    this.type = type
  }
  getEngagements(id) {
    return this.engagementService.getBy(this.type, id)
  }
}

class EngagementController extends CRUDController {
  constructor() {
    super()
  }
  create(name, client, employee, description = '') {
    const startDate = new Date().toISOString()
    const id = v4()
    const created = {
      id, name, client, employee, started: startDate, description
    }
    this.rows.push(created)
    return created
  }
  update(id, name = '', description = ''){
    const target = this.getOne(id)
    if(!target) return;
    this.rows = this.rows
      .map(item => {
        return item.id === id
          ? { ...item,
            ...!!name ? { name } : {},
            ...!!description ? { description } : {}
          }
          : item
      })
    return { updated: id }
  }
  end(id) {
    const target = this.getOne(id)
    if(!target) return;
    if(!!target.ended) return { updated: id };
    this.rows = this.rows
      .map(item => {
        return item.id === id
          ? { ...item, ended: new Date().toISOString() }
          : item
      })
    return { updated: id }
  }
  getBy(type, id) {
    return this.rows.filter(item => item[type] === id)
  }
}

const engagementService = new EngagementController()
const clientService = new ClientEmployeeController(engagementService, 'client')
const employeeService = new ClientEmployeeController(engagementService, 'employee')

const bob = employeeService.create('Bob')
employeeService.create('Alice')
employeeService.create('Charlie')

const acme = clientService.create('ACME')
clientService.create('BOCO')
clientService.create('CASE')

const bobAcmeEngagement = engagementService.create('DOING STUFF', acme.id, bob.id)

module.exports = {
  engagementService,
  clientService,
  employeeService
}


