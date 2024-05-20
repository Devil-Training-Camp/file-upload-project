import Koa from "koa"
import views from "koa-views"
import json from "koa-json"
import onerror from "koa-onerror"
import bodyparser from "koa-bodyparser"
import logger from "koa-logger"
import fileRouter from "./controllers/index"
import index from "./routes/index"
import users from "./routes/users"
import path from "path"
const app = new Koa()

const staticPath = path.join(__dirname, '../public'); // 静态地址
const viewsPath = path.join(__dirname, '../views'); // 模板地址

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  multipart: true,
  //enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 修改了目录结构后此处也要修改
app.use(require('koa-static')(staticPath))
app.use(views(viewsPath, {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(fileRouter.routes(), fileRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
