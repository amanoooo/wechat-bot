const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');



const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    // ctx.router available
});


const ME = '@48e818fe15472f801adf9ff42625a1dcaabbedb1447595af0e49658d67e390de'
const MINMIN = '@bd60b772c2d973375c77721fd4f9c6a3209c8669ca20f29584f994000f587b4f'
const TEST_ROMM_ID = '@@955a0636df1faaaefb23f06d3dedea4c4513971063d89d8c3952ba3e36103400'
/**
 * message: {
    _events: {},
    _eventsCount: 0,
    id: '2535429498782572035',
    payload: {
      id: '2535429498782572035',
      talkerId: '@48e818fe15472f801adf9ff42625a1dcaabbedb1447595af0e49658d67e390de',
      text: 'ding',
      timestamp: 1672048191,
      type: 7,
      listenerId: 'filehelper'
    }
  }
 */
router.post('/message', (ctx, next) => {
    console.log('receive /message %o', ctx.request.body);
    const body = ctx.request.body

    const payload = body.message.payload
    // 敏敏发给我的
    if (payload?.talkerId === MINMIN
        && payload?.listenerId === ME) {
        if (payload?.text === 'ding') {
            console.log('receive ding')
            return ctx.body = {
                code: 0,
                data: 'ok in pair',
            }

        } else {
            console.log('warn ignore')
        }
        // Wechat bot 群
    } else if (payload.roomId === TEST_ROMM_ID) {
        if (payload.text === '@amanoooo ding') {
            return ctx.body = {
                code: 0,
                data: 'ok in room',
            }
        } else {
            console.log('warn ignore with room')
        }
    }
    return ctx.body = {
        code: 1,
        data: 'not ok',
    }
});


app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods())




app.listen(3000);