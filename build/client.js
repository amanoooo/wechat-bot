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
const wechaty_1 = require("wechaty");
const axios_1 = __importDefault(require("axios"));
const wechaty = wechaty_1.WechatyBuilder.build(); // get a Wechaty instance
// async function onScan(qrcode: string, status: number) {
//   generate(qrcode, { small: true })
//   // Generate a QR Code online via
//   // http://goqr.me/api/doc/create-qr-code/
//   const qrcodeImageUrl = [
//     'https://api.qrserver.com/v1/create-qr-code/?data=',
//     encodeURIComponent(qrcode),
//   ].join('')
//   console.log(`[${status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
// }
function onMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(msg.toString());
        const response = yield tryGetResponse(msg);
        if (response.code === 0) {
            msg.say(response.data);
            return;
        }
        else {
            console.log('ignore response');
            return;
        }
        // if (msg.age() > 60) {
        //   console.log('Message discarded because its TOO OLD(than 1 minute)')
        //   return
        // }
        // if (msg.type() !== wechaty.Message.Type.Text
        //   || !/^(ding|ping|bing|code)$/i.test(msg.text())
        //   /*&& !msg.self()*/
        // ) {
        //   return
        // }
        /**
         * 1. reply 'dong'
         */
        // await msg.say('dong')
        // console.log('REPLY: dong')
        // reference https://github.com/wechaty/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/ding-dong-bot.ts
    });
}
function tryGetResponse(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Message: ${message}`);
        const response = yield (0, axios_1.default)({
            method: 'post',
            url: 'http://127.0.0.1:3000/message',
            data: {
                message,
                talker: message.talker,
                listener: message.listener,
                room: message.room
            }
        });
        console.log('receive from cus server with data %o', response.data);
        return response.data;
    });
}
function onError(e) {
    console.error('Bot error:', e);
    /*
    if (bot.logonoff()) {
      bot.say('Wechaty error: ' + e.message).catch(console.error)
    }
    */
}
function onLogout(user) {
    console.log(`${user.name()} logouted`);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        wechaty
            .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
            // .on('scan', (qrcode: string, status: number) => onScan(qrcode, status))
            .on('login', (user) => console.log(`User ${user} logged in`))
            .on('message', onMessage)
            .on('error', onError)
            .on('logout', onLogout);
        wechaty.start();
    });
}
// @ts-ignore
// tryGetResponse({a: 1})
main();
