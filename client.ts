import { generate } from 'qrcode-terminal'
import { Contact, Message, WechatyBuilder } from 'wechaty'
import axios from 'axios'




const wechaty = WechatyBuilder.build() // get a Wechaty instance

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
async function onMessage(msg: Message) {
  console.log(msg.toString())

  const response: any = await tryGetResponse(msg)
  if (response.code === 0) {
    msg.say(response.data)
    return
 } else {
   console.log('ignore response');
   return
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

}


async function tryGetResponse(message: Message) {
  console.log(`Message: ${message}`)
  const response = await axios({
    method: 'post',
    url: 'http://127.0.0.1:3000/message',
    data: {
      message,
      talker: message.talker(),
      listener: message.listener(),
      room: message.room()
    }
  });
  console.log('receive from cus server with data %o', response.data);
  return response.data
}



function onError(e: Error) {
  console.error('Bot error:', e)
  /*
  if (bot.logonoff()) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}

function onLogout(user: Contact) {
  console.log(`${user.name()} logouted`)
}


async function main() {
  wechaty
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
    // .on('scan', (qrcode: string, status: number) => onScan(qrcode, status))
    .on('login', (user: Contact) => console.log(`User ${user} logged in`))
    .on('message', onMessage)
    .on('error', onError)
    .on('logout', onLogout)
  wechaty.start()

}


// @ts-ignore
// tryGetResponse({a: 1})

main()