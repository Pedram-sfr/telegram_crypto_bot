const {Telegraf} = require("telegraf");
require("dotenv").config();
const axios = require("axios")
const bot = new Telegraf(process.env.BOT_TOKEN);
const cryptoToken = process.env.CRYPTO_TOKEN;
const helpMessage = `
/crypto - نمایش قیمت رمز ارز
`;
bot.start(ctx => {
    ctx.sendChatAction("typing");
    const username = ctx.chat.first_name ?? ctx.chat.username
    ctx.reply(`سلام ${username} به ربات ما خوش امدی`)
    ctx.reply(helpMessage)
})
bot.command("crypto",ctx=>{
    bot.telegram.sendMessage(ctx.chat.id,"منو اصلی",{
        reply_to_message_id: ctx.message.message_id,
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "قیمت رمز ارزها", callback_data: "pricing"},
                ],
                [
                    {text: "CryptoCompare", url:"https://www.cryptocompare.com/"},
                ],
            ]
        }
    })
})
bot.action("pricing",ctx=>{
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,"لطفاً یکی از ارزهای دیجیتال زیر را انتخاب کنید",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "BTC", callback_data: "BTC"},
                    {text: "ETH", callback_data: "ETH"},
                ],
                [
                    {text: "BNB", callback_data: "BNB"},
                    {text: "USDC", callback_data: "USDC"},
                ],
                [
                    {text: "DOGE", callback_data: "DOGE"},
                    {text: "SHIB", callback_data: "SHIB"},
                ],
                [
                    {text: "منوی اصلی", callback_data: "mainmenu"},
                ],
            ]
        }
    })
})
bot.action(["BTC","ETH","USDC","DOGE","SHIB","BNB"],async ctx=>{
    ctx.deleteMessage();
    const coin = ctx.match;
    bot.telegram.sendMessage(ctx.chat.id,"لطفاً نرخ مورد نطر خود را انتخاب کنید",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "دلار", callback_data: "USD"},
                    {text: "یورو", callback_data: "EUR"},
                ],
                [
                    {text: "برگشت به لیست ارزها", callback_data: "cryptolist"}, 
                ]
            ]
        }
    })
    bot.action("USD",async ctx=>{
        try {
            ctx.deleteMessage();
             const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD&api_key=${cryptoToken}`
             const data = await axios.get(apiUrl).then(res => res.data)
             ctx.reply(`${coin}: ${data.USD}$`,{
                reply_markup: {
                inline_keyboard: [
                    [
                        {text: "برگشت به لیست ارزها", callback_data: "cryptolist"}, 
                    ]
                ]
                }
            })
        } catch (error) {
             ctx.reply(error.message)
        }
        ctx.answerCbQuery();
    })
    bot.action("EUR",async ctx=>{
        ctx.deleteMessage();
        try {
             const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=EUR&api_key=${cryptoToken}`
             const data = await axios.get(apiUrl).then(res => res.data)
             ctx.reply(`${coin}: ${data.EUR}€`,{
                reply_markup: {
                inline_keyboard: [
                    [
                        {text: "برگشت به لیست ارزها", callback_data: "cryptolist"}, 
                    ]
                ]
                }
            })
        } catch (error) {
             ctx.reply(error.message)
        }
        ctx.answerCbQuery();
    })
   ctx.answerCbQuery();
})
bot.action("cryptolist",ctx=>{
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,"لطفاً یکی از ارزهای دیجیتال زیر را انتخاب کنید",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "BTC", callback_data: "BTC"},
                    {text: "ETH", callback_data: "ETH"},
                ],
                [
                    {text: "BNB", callback_data: "BNB"},
                    {text: "USDC", callback_data: "USDC"},
                ],
                [
                    {text: "DOGE", callback_data: "DOGE"},
                    {text: "SHIB", callback_data: "SHIB"},
                ],
                [
                    {text: "منوی اصلی", callback_data: "mainmenu"},
                ],
            ]
        }
    })
})
bot.action("mainmenu",ctx=>{
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,"منو اصلی",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "قیمت رمز ارزها", callback_data: "pricing"},
                ],
                [
                    {text: "CryptoCompare", url:"https://www.cryptocompare.com/"},
                ],
            ]
        }
    })
})

bot.launch();