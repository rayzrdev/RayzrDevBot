exports.init = bot => {
    this.autorole = bot.managers.get('autorole')
}

exports.run = async (bot, msg) => {
    const member = msg.mentions.members.first()
    if (member) {
        await this.autorole.applyRoles(member)
        return msg.channel.send(`:white_check_mark: Applied all autoroles to \`${member.user.tag}\``)
    }

    const roles = await this.autorole.getRoles(msg.guild.id)

    const keys = Object.keys(roles)

    if (keys.length < 1) {
        throw 'No auto-roles have been set up yet.'
    }

    let message = '__**ROLES**__\n\n'

    await Promise.all(Object.keys(roles).map(async level => {
        const role = await msg.guild.roles.fetch(roles[level]) || { name: '~~INVALID-ROLE~~' }
        message += `:arrow_right: ***${role.name}***\n:white_small_square: Given at level ${level}\n\n`
    }))

    msg.delete()
    msg.channel.send(message)
}

exports.info = {
    name: 'roles',
    usage: 'roles',
    description: 'Shows all rank-based roles'
}
