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
const ME = '@48969f78eb66a9e8e674ce31fe9c6a09a4174bff2baed8f28429afb18a69146d';
const MINMIN = '@bd60b772c2d973375c77721fd4f9c6a3209c8669ca20f29584f994000f587b4f';
const ACTION_ROOM_IDS = [
    //  Wechat bot 群
    '@@955a0636df1faaaefb23f06d3dedea4c4513971063d89d8c3952ba3e36103400',
    // jane 和小号
    "@@df378bea2317bf4448e27a2d428cd4801bed826181c86edc4217ddbfe74539cb",
    // 工作无关群
    "@@ad37302f11056be8739c9dbc98b915ee4f2fb1e491c35be8f8bf573db22fe525",
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
    var _a;
    console.log('receive /message %o', ctx.request.body);
    const body = ctx.request.body;
    const payload = body.message.payload;
    // 敏敏发给我的
    if ((payload === null || payload === void 0 ? void 0 : payload.talkerId) === MINMIN
        && (payload === null || payload === void 0 ? void 0 : payload.listenerId) === ME) {
        if ((payload === null || payload === void 0 ? void 0 : payload.text) === 'ding') {
            console.log('receive ding');
            return ctx.body = {
                code: 0,
                data: 'ok in pair',
            };
        }
        else {
            console.log('warn ignore');
        }
        //授权的聊天群
    }
    else if (ACTION_ROOM_IDS.indexOf(payload.roomId) > -1
        && ((_a = payload.mentionIdList) === null || _a === void 0 ? void 0 : _a.indexOf(ME)) > -1) {
        const question = payload.text.split(' ').slice(1).join(' ');
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
    console.log("server started");
});
