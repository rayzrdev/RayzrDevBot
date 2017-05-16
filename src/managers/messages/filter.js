const fuhk = require('fuhk');

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
        filter: input => fuhk(input).length > 0,
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
        filter: /[A-Z\s]{15,}/,
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
        filter: /([a-z])\1{12,}/i,
        messages: [
            'Don\'t spam characters, really.',
            'Character spam is pointless.',
            'No need to repeat yourself.',
            'Character spam is not allowed here!',
            'Are you done yet?',
            'No more of that!'
        ]
    },
    {
        filter: (input, context) => {
            return context.channel.name !== 'promote-yourself'
                && !context.member.hasPermission('MANAGE_MESSAGES')
                && /(https?)?(:\/\/)?discord\.(io|gg|me)\/?[^/]+/i.test(input);
        },
        messages: [
            'Please post server invites in #promote-yourself.',
            'Server invites belong in #promote-yourself.',
            'Please move all server invites to #promote-yourself.'
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
        let warning = this.getFilterMessage(message, message.content);

        if (!warning && message.embeds.length > 0) {
            message.embeds.forEach(embed => {
                warning = warning
                    || this.getFilterMessage(message, embed.title)
                    || this.getFilterMessage(message, embed.description)
                    || this.getFilterMessage(message, (embed.footer || {}).text);
            });
        }

        if (warning) {
            message.delete();
            message.channel.send(warning).then(m => m.delete(2000));
            return;
        }
    }

    getFilterMessage(context, content) {
        if (!content) return;

        const violatedFilter = filters.find(item => {
            if (item.filter instanceof RegExp) {
                return item.filter.test(content);
            } else if (typeof item.filter === 'function') {
                return item.filter(content, context);
            }
        });

        if (violatedFilter) {
            return randomItem(violatedFilter.messages) + ' ' + randomItem(emojis);
        }
    }
}

module.exports = FilterManager;