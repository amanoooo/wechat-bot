import Koa from 'koa';
import Router from '@koa/router';
import { koaBody } from 'koa-body';
import { fetchAnswer } from './openai';



const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    // ctx.router available
});


const ME = '@48969f78eb66a9e8e674ce31fe9c6a09a4174bff2baed8f28429afb18a69146d'
const MINMIN = '@bd60b772c2d973375c77721fd4f9c6a3209c8669ca20f29584f994000f587b4f'
const ROOM_TOPICS = [
    'Jane和小号',
    "工作无关群",
    "Wechat Bot",
    "上海慕孜元老会",
    "田林公益事业群",
    "嘎嘎嘎",
    "COACH可以聚餐了",
]
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
      listenerId: 'filehelper',
      roomId: '@@df378bea2317bf4448e27a2d428cd4801bed826181c86edc4217ddbfe74539cb',
      mentionIdList: [
        '@48969f78eb66a9e8e674ce31fe9c6a09a4174bff2baed8f28429afb18a69146d'
      ]
    }
  }
 */
router.post('/message', async (ctx, next) => {
    console.log('receive /message %o', ctx.request.body);
    const body = ctx.request.body

    const msgPayload = body.message.payload
    const roomPayload = body.room?.payload
    const talkerPayload = body.talker?.payload


    if (!msgPayload.text.trim()) {
        console.log('empty msg');
        return 
    }

    if (
        roomPayload.topic &&
        ROOM_TOPICS.indexOf(roomPayload.topic) > -1
        && msgPayload.text?.startsWith('@amanoooo')
    ) {

        const question = msgPayload.text.replaceAll('@amanoooo', '') as string
        if (question == '') {
            console.log('return due to empty string')
            return
        }
        console.log('question', question)
        const answer = await fetchAnswer(question)
        return ctx.body = {
            code: 0,
            data: answer,
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




app.listen(3000, () => {
    console.log("server started with pid", process.pid)
});