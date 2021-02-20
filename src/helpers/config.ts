import { ColorResolvable } from 'discord.js'
import fse from 'fs-extra'
import { resolve } from 'path'
import { BASE_DIR } from './settings'

export type BotConfig = {
    name: string
    prefix: string
    color: ColorResolvable
    token: string
    curseforgeAPIToken: string
    joinMessage: string
    statusFormat: string
    ownerID: string
    mainChannel: string
    countingChannel: string
    communism: EmojiChannel
    capitalism: EmojiChannel
    userRoles?: string[]
}

export type EmojiChannel = {
    channel: string
    emojis: string[]
}

let config: BotConfig | null = null

const CONFIG_PATH  = resolve(BASE_DIR, 'config.json')
const CONFIG_EXAMPLE_PATH = resolve(BASE_DIR, 'config-example.json')

export const loadConfig = (): BotConfig => {
    if (!fse.existsSync(CONFIG_PATH)) {
        fse.copySync(CONFIG_EXAMPLE_PATH, CONFIG_PATH)
        throw 'The config.json file was not set up, please fill it out.'
    }

    config = fse.readJSONSync(CONFIG_PATH)

    if (!config.token || !/^[A-Za-z0-9._-]+$/.test(config.token)) {
        throw 'Config is missing a valid bot token! Please acquire one at https://discordapp.com/developers/applications/me'
    }

    return config
}

export const getConfig = (): BotConfig => {
    if (!config) {
        return loadConfig()
    }

    return config
}

export const saveConfig = (): void => {
    fse.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4))
}
