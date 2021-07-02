const sqlite3 = require('sqlite3').verbose()
const tables = {
  employees: {
    fields: {
      id: ['text', 'primary key'],
      name: ['text', 'not null']
    },
    keys: {}
  },
  clients: {
    fields: {
      id: ['text', 'primary key'],
      name: ['text', 'not null']
    },
    keys: {}
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
class DbClient {
  db;
  done;
  constructor() {
    this.db = new sqlite3.Database(dbFile)
    done = false;
  }
  async init() {
    if(!this.done) {
      await this.db.run(
        'CREATE TABLE IF NOT EXISTS employees (id text primary key, name text not null);'
      )
      await this.db.run(
        'CREATE TABLE IF NOT EXISTS clients (id text primary key, name text not null);'
      )
      await this.db.run(
        `CREATE TABLE IF NOT EXISTS engagements (
          id text primary key,
          name text not null,
          description text,
          employee text not null,
          client text not null,
          started date not null,
          ended date,
          foreign key (employee) references employees(id),
          foreign key (client) references clients(id);`
      )
    }
    this.done = true;
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
      const query = `select * from ${entity} where id = ${id}`
      this.db.get(query, (err, row) => {
        if(err){
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }
  async updateOne(entity, id, data) {
    return new Promise((resolve, reject) => {
      let query = `update ${entity} set `
      Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        query += `${key} = ${value} `
      })
      query += `where id = ${id}`
      this.db.run(query, (err) => {
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
    const values = [id, ...Object.values(data)].join(',')
    let query = `insert into ${entity} (${keys}) values (${values})`
    await this.db.run(query)
    return id;

  }
}

module.exports = async () => {
  const dbClient = new DbClient()
  await dbClient.init()
  return dbClient
}