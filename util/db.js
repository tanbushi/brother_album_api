const mysql = require('mysql')
const mysqlConfig = require('./db_config').mysql

const pool = mysql.createPool(mysqlConfig)

function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (error, rows) => {
          if (error) {
            reject(error)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = {
  query,
}
