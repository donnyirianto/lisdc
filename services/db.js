const mysql = require('mysql2/promise');
const config = require('../config');

const conn =  mysql.createPool(config.db); 

async function query(query, param) {
  try {
    const [result] = await conn.query(query, param)

    return result  
  } catch (e) {
    console.log(e)
  }
  
}
async function insert(query) {
  try {
    const result = await conn.query(query)
    
    return result  
  } catch (e) {
    console.log(e)
  }
  
}

module.exports = {
  query, insert
}