const Manager = require('../manager');

class AutoRole extends Manager {
    getName() { return 'autorole'; }

    preInit() {
        this.settings = this.handler.get('settings');

        const self = this;

        this.handler.events.on('levelChange', async event => {
            const role = await self.getRole(event.member.guild, event.to);
            if (!role) {
                return;
            }

            event.member.addRole(role);
        });
    }

    async getRoles(id) {
        return await this.settings.get(`autoroles.${id}`, { default: {} });
    }

    async setRoles(id, roles) {
        if (typeof roles !== 'object') throw 'Invalid roles object!';

        return await this.settings.set(`autoroles.${id}`, roles);
    }

    async getRole(guild, level) {
        const roles = await this.getRoles(guild.id);

        if (roles[level]) {
            return guild.roles.get(roles[level]);
        }
    }

    async addRole(role, level) {
        const roles = await this.getRoles(role.guild.id);
        roles[level] = role.id;
        return await this.setRoles(role.guild.id, roles);
    }

    async removeRole(guild, level) {
        const roles = await this.getRoles(guild.id);

        if (!roles[level]) {
            return false;
        }

        delete roles[level];
        await this.setRoles(guild.id, roles);

        return true;
    }

    async applyRoles(member) {
        const roles = await this.getRoles(member.guild.id);
        const level = await this.handler.get('levels').getLevel(member.id);

        let changed = false;

        for (let i = 0; i <= level; i++) {
            const role = roles[i];

            if (role && !member.roles.has(role)) {
                member.addRole(member.guild.roles.get(role));
                changed = true;
            }
        }

        return changed;
    }
}

module.exports = AutoRole;
