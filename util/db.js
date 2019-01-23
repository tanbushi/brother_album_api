const mysql = require('mysql')

const pool = mysql.createPool({
  host: '127.0.0.1', // 改为自己的 host
  user: 'root', // 改为自己的 user
  password: 'abc123', // 改为自己的 password
  database: 'brother_album',
})

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
