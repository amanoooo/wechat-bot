const { WechatyBuilder } = require('wechaty')

const wechaty = WechatyBuilder.build() // get a Wechaty instance
wechaty
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on('login', user => console.log(`User ${user} logged in`))
  .on('message', handleMessage)
wechaty.start()



async function handleMessage(message) {
  console.log(`Message: ${message}`)
  const data = await axios({
    method: 'post',
    url: 'http://127.0.0.1/message',
    data: {
      message
    }
  });
  console.log('receive data', data);
  
}