import Manager from '../manager';

class AutoRole extends Manager {
    settings: any;
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit(bot: any) {
        this.settings = this.handler.get('settings');

        const self = this;

        this.handler.events.on('levelChange', async (event: any) => {
            const role = await self.getRole(event.member.guild, event.to);
            if (!role) {
                return;
            }

            event.member.addRole(role);
        });

        bot.on('guildMemberAdd', (member: any) => this.applyRoles(member));
    }

    // @ts-expect-error TS(7010): 'getRoles', which lacks return-type annotation, im... Remove this comment to see the full error message
    getRoles();

    // @ts-expect-error TS(2389): Function implementation name must be 'getRoles'.
    async setRoles(id: any, roles: any) {
        if (typeof roles !== 'object') throw 'Invalid roles object!';

        return await this.settings.set(`autoroles.${id}`, roles);
    }

    async getRole(guild: any, level: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const roles = await this.getRoles(guild.id);

        if (roles[level]) {
            return guild.roles.get(roles[level]);
        }
    }

    async addRole(role: any, level: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const roles = await this.getRoles(role.guild.id);
        roles[level] = role.id;
        return await this.setRoles(role.guild.id, roles);
    }

    async removeRole(guild: any, level: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const roles = await this.getRoles(guild.id);

        if (!roles[level]) {
            return false;
        }

        delete roles[level];
        await this.setRoles(guild.id, roles);

        return true;
    }

    async applyRoles(member: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        const roles = await this.getRoles(member.guild.id);
        const level = await this.handler.get('levels').getLevel(member.id);

        const promises = [];

        for (let i = 0; i <= level; i++) {
            const role = roles[i];

            if (role && !member.roles.cache.has(role)) {
                promises.push(member.roles.add(role));
            }
        }

        await Promise.all(promises);

        return promises.length > 0;
    }
}

export default AutoRole;
