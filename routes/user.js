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

router.get('/profile', (ctx) => {
  const { user } = ctx
  ctx.body = {
    code: 1001,
    result: {
      userInfo: user,
    },
  }
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
    const {
      id, nickname, token,
    } = userList[0]
    ctx.body = {
      code: '1001',
      result: {
        id,
        token,
        authed: nickname !== '',
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
      id: insertId,
      token,
      authed: false,
    },
  }
})

router.post('/update', async (ctx) => {
  const { user } = ctx
  const {
    nickName, avatarUrl, city, country, device, gender, province, language,
  } = ctx.request.body
  const sql = `update user set 
      user.nickname='${nickName}',
      user.avatar='${avatarUrl}',
      user.device='${device}',
      user.gender='${gender}',
      user.country='${country}',
      user.province='${province}',
      user.city='${city}',
      user.language='${language}'
    where user.id = ${user.id}
  `
  const { affectedRows } = await query(sql)
  if (!affectedRows) {
    ctx.body = {
      code: 1002,
      msg: '授权失败',
    }
    return
  }

  ctx.body = {
    code: 1001,
    msg: '授权成功',
    result: {
      authed: true,
    },
  }
})

module.exports = router
