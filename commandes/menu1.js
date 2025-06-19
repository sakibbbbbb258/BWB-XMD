const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "menu", categorie: "Menu" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    let coms = {};
    let mode = "public";

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie]) {
            coms[com.categorie] = [];
        }
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭━═「 *${s.BOT}* 」═━❂
┃🔋╭────••••────➻
┃🔋│🌏 OWNER : ${s.OWNER_NAME}
┃🔋│🤖 PREFIX : [ ${s.PREFIXE} ]
┃🔋│🔘 𝙼ODE : *${mode}*
┃🔋│🔅 RAM  : 𝟴/𝟭𝟯𝟮 𝗚𝗕
┃🔋│◆ DATE  : *${date}*
┃🔋│🌐 PLATFORM : ${os.platform()}
┃🔋│☠️ DEVELOPER : ғprincetech
┃🔋│⏳ COMMANDS : ${cm.length}
┃🔋│🥇 THEME : BWB
┃⊛└────••••────➻
╰─━━━━══──══━━━❂\n${readmore}
`;

    let menuMsg = `𝙱W𝙱-𝚇𝙼𝙳 `;
    
    for (const cat in coms) {
        menuMsg += `
❁━━〔 *${cat}* 〕━━❁
╭━━══••══━━••⊷
║◆┊ `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
║◆┊ ${s.PREFIXE}  *${cmd}*`;    
        }
        menuMsg += `
║◆┊
╰─━━═••═━━••⊷`;
    }
    
    menuMsg += `
> Made By prince\n`;

    try {
        const senderName = nomAuteurMessage || message.from;  // Use correct variable for sender name
        await zk.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [senderName],
                externalAdReply: {
                    title: "B.W.B-XMD MENU LIST",
                    body: "Dont worry bro I have more tap to follow",
                    thumbnailUrl: "https://files.catbox.moe/6xk8eh.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vb6B9xFCxoAseuG1g610",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵🥵 Menu error: " + error);
    }
});

          
