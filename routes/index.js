const router = require('koa-router')()
const { query } = require('../util/db')

async function selectAllUser() {
  const sql = 'select * from user'
  const dataList = await query(sql)
  return dataList
}

router.get('/', async (ctx) => {
  const dataList = await selectAllUser()
  console.log(dataList)
  // return dataList
  await ctx.render('index', {
    title: 'Hello Koa 2!',
  })
})

router.get('/string', async (ctx) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx) => {
  ctx.body = {
    title: 'koa2 json',
  }
})

module.exports = router
