const deleteLotsOfMessages = async (channel, amount) => {
    let amountDeleted = 0;

    while (amountDeleted < amount) {
        const amountToDelete = Math.min(amount - amountDeleted, 100);

        try {
            const deleted = await channel.bulkDelete(amountToDelete);
            amountDeleted += deleted.size;

            if (deleted.size < amountToDelete) {
                return amountDeleted;
            }
        } catch (err) {
            return amountDeleted;
        }
    }

    return amountDeleted;
};

exports.run = async (bot, msg, args) => {
    await msg.delete();
    if (isNaN(args[0])) {
        throw 'Please provide a number of messages to delete!';
    }

    const amount = Math.min(parseInt(args[0]), 5000);
    if (amount < 1) {
        throw 'You cannot delete less than 1 message!';
    }

    const amountDeleted = await deleteLotsOfMessages(msg.channel, amount);
    msg.channel.send(`Deleted ${amountDeleted} messages. :flame:`).then(m => m.delete(3000));
};

exports.info = {
    name: 'purge',
    usage: 'purge <amount>',
    description: 'Purges a certain number of messages',
    perms: 'MANAGE_MESSAGES'
};
