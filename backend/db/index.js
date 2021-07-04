const sqlite3 = require('sqlite3').verbose()
const { v4 } = require('uuid')
const { NotFoundError } = require('../utils/errors')

const tables = {
  employees: {
    fields: {
      id: ['text', 'primary key'],
      name: ['text', 'not null']
    }
  },
  clients: {
    fields: {
      id: ['text', 'primary key'],
      name: ['text', 'not null']
    }
  },
  engagements: {
    fields: {
      id: ['text', 'primary key'],
      name: ['text', 'not null'],
      description: ['text'],
      started: ['date', 'not null'],
      ended: ['date'],
      employee: ['text', 'not null'],
      client: ['text', 'not null']
    },
    keys: {
      employee: {
        table: 'employees',
        key: 'id'
      },
      client: {
        table: 'clients',
        key: 'id'
      }
    }
  }
}
const dbFile = 'data.db'
class DbClient {
  constructor(tables) {
    this.db = new sqlite3.Database(dbFile)
    this.done = false;
    this.tables = tables
  }

  async makeTable(tableStructure, name) {
    return new Promise(async (resolve, reject) => {
      if(!tableStructure[name]) {
        resolve(); 
      }
      const details = tableStructure[name]
      let query = 'CREATE TABLE IF NOT EXISTS ' + name;
      const { keys, fields } = details;
      query += '('
      if(fields) {
        const fieldDetails = Object.entries(fields);
        const fieldString = fieldDetails
          .map(([fieldName, attrs]) => fieldName + " " + attrs.join(' ') )
          .join(', ')
        query+=fieldString
      }
      if(keys) {
        query += ', '
        query += Object.entries(keys)
          .map(([keyName, detail]) => `foreign key (${keyName}) references ${detail.table}(${detail.key})` )
          .join(', ')
      }
      query += ');'
      const created = await this.db.exec(query);
      resolve(created)
    })
  }

  async init(tables) {
    if(!this.done) {
      const tableNames = Object.keys(tables);
      Promise.all(tableNames.map((tableName) => {
        return this.makeTable(tables, tableName)
      }))
    }
    this.done = true;
    return this
  }

  async all(query, params) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if(err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
  })
  }

  async getAll(entity) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${entity}`
      this.db.all(query, (err, rows) => {
        if(err) {
          reject(err)
        } else {
          resolve(rows);
        }
      })
    })
  }

  async getByID(entity, id) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${entity} where id = ?`
      this.db.get(query, id, (err, row) => {
        if(err) {
          reject(err)
        } else {
          if(!row) {
            reject(new NotFoundError())
          } else {
            resolve(row)
          }
        }
      })
    })
  }

  async updateOne(entity, id, data) {
    return new Promise((resolve, reject) => {
      let query = `update ${entity} set `
      const params = {}
      Object.keys(data).forEach(key => {
        const paramKey = ":"+key
        query += `${key} = ${paramKey} `
        params[paramKey] = data[key]
      })
      query += `where id = "${id}"`
      this.db.run(query, params, (err) => {
        if(err){
          reject(err)
        } else {
          resolve(id);
        }
      })
    })
  }

  async createOne(entity, data) {
    const id = v4()
    const keys = ['id', ...Object.keys(data)].join(',')
    const values = [id, ...Object.values(data)]
      .map((item) => typeof item === 'string' ? `"${item}"` : item)
      .join(',')
    let query = `insert into ${entity} (${keys}) values (${values})`
    await this.db.exec(query)
    return id;
  }

}
const dbClient = new DbClient()
dbClient.init(tables)
module.exports = dbClient;
