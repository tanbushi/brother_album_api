const router = require('koa-router')()
const rp = require('request-promise')
const qs = require('query-string')
const { appid, secret } = require('../config/index.js')
const { query } = require('../util/db')

// 生成token
const guidGenerator = () => { // 生产唯一的字符串
  /* eslint-disable-next-line */
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}

router.prefix('/user')

router.get('/', (ctx) => {
  ctx.body = 'this is a users response!'
})

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async (ctx) => {
  const { code } = ctx.request.body
  const params = qs.stringify({
    appid,
    secret,
    js_code: code,
    grant_type: 'authorization_code',
  })
  const body = await rp(`https://api.weixin.qq.com/sns/jscode2session?${params}`)
  const bodyParsed = JSON.parse(body)

  if (bodyParsed.errcode) {
    ctx.body = {
      code: 1002,
      msg: '无效的code',
      detail: body,
    }
    return
  }

  const sessionKey = bodyParsed.session_key
  const openId = bodyParsed.openid

  // 检查是否有存在的用户
  const existSql = `select * from xcxuserauth where openId = '${openId}'`
  const authList = await query(existSql)
  if (authList.length >= 1) {
    const existId = authList[0].userId
    const existUserSql = `select * from user where id = '${existId}'`
    const userList = await query(existUserSql)
    const user = userList[0]
    ctx.body = {
      code: '1001',
      result: {
        token: user.token,
      },
    }
    return
  }

  // 新用户的逻辑
  const token = guidGenerator()

  const sql = `insert into user(token) values('${token}')`
  const { insertId } = await query(sql)

  if (!insertId) {
    ctx.body = {
      code: 1002,
      msg: '创建用户失败',
    }
  }

  const xcxauthSql = `insert into xcxuserauth(userId, openId, sessionKey) values('${insertId}', '${openId}', '${sessionKey}')`
  await query(xcxauthSql)
  ctx.body = {
    code: '1001',
    result: {
      token,
    },
  }
})

module.exports = router
