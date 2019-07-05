import * as os from 'os';

export class IpResolver {
    constructor() {}

    static getIPv4Addresses() {
        const interfaces = os.networkInterfaces();
        let addresses = [];

        Object.keys(interfaces).forEach((ifaceName) => {
            interfaces[ifaceName].forEach((iface) => {
                if (iface.family === 'IPv4' && !iface.internal) {
                    addresses.push(iface.address);
                }
            })
        });

        return addresses;
    }

    static getIPv4Address() {
        const addresses = IpResolver.getIPv4Addresses();
        return addresses[0];
    }
}
