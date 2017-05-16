const Manager = require('../manager');
const emojis = [
    ':angry:',
    ':face_palm:',
    ':confused:',
    ':unamused:',
    ':-1:',
    ':raised_hand:',
    ':eyes:',
    ':wink:',
    ':upside_down:',
    ':stuck_out_tongue_winking_eye:',
    ':thinking:'
];

const filters = [
    {
        filter: new RegExp(require('badwords-list').regex.source, 'i'),
        messages: [
            'Swearing is not allowed!',
            'Don\'t do that.',
            'Denied.',
            'Please follow the rules.',
            'Nope.',
            'No swearing here!'
        ]
    },
    {
        filter: /[A-Z\s]{5,}/,
        messages: [
            'Please don\'t do that.',
            'Don\'t spam caps.',
            'Disable your capslock, please.',
            'Really?'
        ]
    },
    {
        // In the regex token '{X,}', the number of
        // chars needed to count as char spam is X + 1
        filter: /([a-z])\1{5,}/i,
        messages: [
            'Don\'t spam characters, really.',
            'Character spam is pointless.',
            'No need to repeat yourself.',
            'Character spam is not allowed here!',
            'Are you done yet?',
            'No more of that!'
        ]
    }
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

class FilterManager extends Manager {
    getName() { return 'filter'; }

    init() {
        this.bot.on('messageUpdate', (_, message) => {
            this.onMessage(message);
        });
    }

    onMessage(message) {
        if (message.content.startsWith('//')) return;
        let warning = this.getFilterMessage(message.content);
        if (!warning && message.embeds.length > 0) {
            message.embeds.forEach(embed => {
                warning = warning
                    || this.getFilterMessage(embed.title)
                    || this.getFilterMessage(embed.description)
                    || this.getFilterMessage((embed.footer || {}).text);
            });
        }

        if (warning) {
            message.delete();
            message.channel.send(warning).then(m => m.delete(2000));
        }
    }

    getFilterMessage(content) {
        if (!content) return;

        const violatedFilter = filters.find(item => {
            if (item.filter instanceof RegExp) {
                return item.filter.test(content);
            } else if (typeof item.filter === 'function') {
                return item.filter(content);
            }
        });

        if (violatedFilter) {
            return randomItem(violatedFilter.messages) + ' ' + randomItem(emojis);
        }
    }
}

module.exports = FilterManager;