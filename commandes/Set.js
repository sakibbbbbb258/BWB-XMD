
const { zokou } = require('../framework/zokou');
const s = require('../set');

// Utility function to check valid HEROKU key
function getHerokuToken() {
    return s.HEROKU_API_KEY || s.HEROKU_APY_KEY; // Use correct key, fallback if typo exists
}

// List of Heroku settings you want to command via shortcut
const herokuSettings = [
    "ANTICALL",
    "AUTOREACT",
    "AUDIOCHATBOT",
    "UPDATELATEST"
];

// Set Heroku variable by shortcut command, e.g. .anticall on/off
herokuSettings.forEach(setting => {
    zokou(
        {
            nomCom: setting.toLowerCase(),
            categorie: "heroku"
        }, async (dest, zk, commandeOptions) => {
            const { repondre, superUser, arg } = commandeOptions;
            if (!superUser) { repondre('Only Mods can use this command'); return; }
            if (!arg[0] || !["on", "off", "true", "false", "enable", "disable"].includes(arg[0].toLowerCase())) {
                repondre(`Usage: .${setting.toLowerCase()} on/off`);
                return;
            }
            const Heroku = require("heroku-client");
            const heroku = new Heroku({
                token: getHerokuToken(),
            });
            let baseURI = "/apps/" + s.HEROKU_APP_NAME;
            let value = ["on", "true", "enable"].includes(arg[0].toLowerCase()) ? "true" : "false";
            try {
                await heroku.patch(baseURI + "/config-vars", {
                    body: {
                        [setting]: value,
                    },
                });
                await repondre(`${setting} set to ${value}. Heroku var updated, bot is rebooting...`);
            } catch (e) {
                repondre('Heroku error: ' + e);
            }
        });
});

// Generic setvar for custom variables
zokou(
    {
        nomCom: "setvar",
        categorie: "heroku"
    }, async (dest, zk, commandeOptions) => {
        const { repondre, superUser, arg } = commandeOptions;
        if (!superUser) { repondre('Only Mods can use this command'); return; }
        if (!arg[0] || !(arg.join('').split('=').length === 2)) {
            repondre('Bad format. Example: setvar OWNER_NAME=Charles ke');
            return;
        }
        const text = arg.join(" ");
        const Heroku = require("heroku-client");
        const heroku = new Heroku({ token: getHerokuToken() });
        let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        try {
            await heroku.patch(baseURI + "/config-vars", {
                body: {
                    [text.split('=')[0].trim()]: text.split('=')[1].trim(),
                },
            });
            await repondre('Heroku var changed. The bot is rebooting...');
        } catch (e) {
            repondre('Heroku error: ' + e);
        }
    }
);

// Get all Heroku variables
zokou(
    {
        nomCom: "getallvar",
        categorie: "heroku"
    }, async (dest, zk, commandeOptions) => {
        const { repondre, superUser } = commandeOptions;
        if (!superUser) { repondre('Only Mods can use this command'); return; }
        const Heroku = require("heroku-client");
        const heroku = new Heroku({ token: getHerokuToken() });
        let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        try {
            let h = await heroku.get(baseURI + '/config-vars');
            let str = '*VARS*\n\n';
            for (let vr in h) {
                str += '🕵 *' + vr + '* = ' + h[vr] + '\n';
            }
            repondre(str);
        } catch (e) {
            repondre('Heroku error: ' + e);
        }
    }
);

// Get specific Heroku variable
zokou(
    {
        nomCom: "getvar",
        categorie: "heroku"
    }, async (dest, zk, commandeOptions) => {
        const { repondre, superUser, arg } = commandeOptions;
        if (!superUser) { repondre('Only Mods can use this command'); return; }
        if (!arg[0]) { repondre('Insert the variable name in capital letters'); return; }
        try {
            const Heroku = require("heroku-client");
            const heroku = new Heroku({ token: getHerokuToken() });
            let baseURI = "/apps/" + s.HEROKU_APP_NAME;
            let h = await heroku.get(baseURI + '/config-vars');
            let varName = arg.join(' ').trim().toUpperCase();
            if (h[varName] !== undefined) {
                repondre(varName + ' = ' + h[varName]);
            } else {
                repondre('Variable not found: ' + varName);
            }
        } catch (e) {
            repondre('Heroku error: ' + e);
        }
    }
);
