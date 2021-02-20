const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const runCommandAsync = (command, args) => new Promise((resolve, reject) => {
    spawn(command, args, { stdio: 'inherit' }).on('exit', code => (code === 0 ? resolve : reject)(code))
})

const asyncGitPull = () => runCommandAsync('git', ['pull'])
const asyncNpmCi = () => runCommandAsync('npm', ['ci'])

exports.run = async (bot, msg) => {
    const status = await msg.channel.send(':arrows_counterclockwise: | Updating...')

    if (!fs.existsSync(path.resolve('.', '.git'))) {
        throw 'No .git folder was found in the CWD!'
    }

    try {
        await asyncGitPull()
    } catch (error) {
        console.error(error)
        throw 'Failed to run `git pull`.'
    }
    
    try {
        await asyncNpmCi()
    } catch (error) {
        console.error(error)
        throw 'Failed to run `npm ci`.'
    }

    await status.edit(':arrows_counterclockwise: | Restarting...')

    process.exit(1)
}

exports.info = {
    name: 'update',
    description: 'Updates the bot',
    ownerOnly: true
}
