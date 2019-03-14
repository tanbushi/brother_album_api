const router = require('koa-router')()
const { query } = require('../util/db')

router.prefix('/picture')

router.get('/', async (ctx) => {
  const { user } = ctx
  if (!user) {
    ctx.body = {
      code: 1003,
      msg: '无效token',
    }
    return
  }
  const sql = `select * from picture where userId = ${user.id}`
  const pictureList = await query(sql)
  ctx.body = {
    code: 1001,
    result: {
      pictureList,
    },
  }
})

module.exports = router
