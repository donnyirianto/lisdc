const mysql = require('mysql2/promise');
const config = require('../config');

const conn =  mysql.createPool(config.db); 

async function query(query, param) {
  const [result] = await conn.query(query, param)

  return result
}
async function insert(query) {
  const result = await conn.query(query)

  return result

}

module.exports = {
  query, insert
}