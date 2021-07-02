const express = require('express')
const registerEmployeeRoutes = require('./routes/employees')
const registerClientRoutes = require('./routes/clients')
const registerEngagementRoutes = require('./routes/engagements')

const app = express()

registerEmployeeRoutes(app)
registerClientRoutes(app)
registerEngagementRoutes(app)

const port = process.env.API_PORT || 3000

app.listen((port), () => {
  console.log('app is running on localhost:', port)
})