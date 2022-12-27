"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_body_1 = require("koa-body");
const openai_1 = require("./openai");
const app = new koa_1.default();
const router = new router_1.default();
router.get('/', (ctx, next) => {
    // ctx.router available
});
const ROOM_TOPICS = [
    'Jane和小号',
    "工作无关群",
    "Wechat Bot",
    "上海慕孜元老会",
    "田林公益事业群",
    "嘎嘎嘎",
    "COACH可以聚餐了",
];
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
router.post('/message', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log('receive /message %o', ctx.request.body);
    const body = ctx.request.body;
    const msgPayload = body.message.payload;
    const roomPayload = (_a = body.room) === null || _a === void 0 ? void 0 : _a.payload;
    const talkerPayload = (_b = body.talker) === null || _b === void 0 ? void 0 : _b.payload;
    if (!msgPayload.text.trim() || !roomPayload) {
        console.log('empty msg or room');
        return;
    }
    if (roomPayload.topic &&
        ROOM_TOPICS.indexOf(roomPayload.topic) > -1
        && ((_c = msgPayload.text) === null || _c === void 0 ? void 0 : _c.startsWith('@amanoooo'))) {
        const question = msgPayload.text.replaceAll('@amanoooo', '');
        if (question == '') {
            console.log('return due to empty string');
            return;
        }
        console.log('question', question);
        const answer = yield (0, openai_1.fetchAnswer)(question);
        return ctx.body = {
            code: 0,
            data: answer,
        };
    }
    return ctx.body = {
        code: 1,
        data: 'not ok',
    };
}));
app
    .use((0, koa_body_1.koaBody)())
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(3000, () => {
    console.log("server started with pid", process.pid);
});
