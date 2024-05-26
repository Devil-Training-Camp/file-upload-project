import Koa from "koa"
//import views from "koa-views"
import json from "koa-json"
//import onerror from "koa-onerror"
import koaBody from 'koa-body'
import logger from "koa-logger"
import koa_static from "koa-static"
import fileRouter from "./controllers/index"
import path from "path"
const app = new Koa()

const staticPath = path.join(__dirname, '../public'); // 静态地址
const viewsPath = path.join(__dirname, '../views'); // 模板地址

// error handler
//onerror(app)

// middlewares
// app.use(bodyparser())
app.use(json())
app.use(koaBody())
app.use(logger())
// 修改了目录结构后此处也要修改
app.use(koa_static(staticPath))
// app.use(views(viewsPath, {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  await next()
  console.log(`${ctx.method} ${ctx.url}`)
})

// routes
app.use(fileRouter.routes())
app.use(fileRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
