const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const asyncGitPull = () => new Promise((resolve, reject) => {
    spawn('git', ['pull'], { stdio: 'inherit' }).on('exit', code => (code === 0 ? resolve : reject)(code));
});

exports.run = async (bot, msg) => {
    const status = await msg.channel.send(':arrows_counterclockwise: | Updating...');

    if (!fs.existsSync(path.resolve('.', '.git'))) {
        throw 'No .git folder was found in the CWD!';
    }

    try {
        await asyncGitPull();
    } catch (error) {
        throw 'Failed to run `git pull`.';
    }

    await status.edit(':arrows_counterclockwise: | Restarting...');

    // TODO: again, we need a better way to restart. systemd ftw tho amirite
    process.exit(1);
};

exports.info = {
    name: 'update',
    description: 'Updates the bot',
    ownerOnly: true
};
