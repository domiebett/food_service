"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = __importStar(require("os"));
var IpResolver = /** @class */ (function () {
    function IpResolver() {
    }
    IpResolver.getIPv4Addresses = function () {
        var interfaces = os.networkInterfaces();
        var addresses = [];
        Object.keys(interfaces).forEach(function (ifaceName) {
            interfaces[ifaceName].forEach(function (iface) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    addresses.push(iface.address);
                }
            });
        });
        return addresses;
    };
    IpResolver.getIPv4Address = function () {
        var addresses = IpResolver.getIPv4Addresses();
        return addresses[0];
    };
    return IpResolver;
}());
exports.IpResolver = IpResolver;
//# sourceMappingURL=IpResolver.js.map

//# sourceMappingURL={"version":3,"file":"IpResolver.js","sourceRoot":"","sources":["IpResolver.ts"],"names":[],"mappings":";;;;;;;;;AAAA,qCAAyB;AAEzB;IACI;IAAe,CAAC;IAET,2BAAgB,GAAvB;QACI,IAAM,UAAU,GAAG,EAAE,CAAC,iBAAiB,EAAE,CAAC;QAC1C,IAAI,SAAS,GAAG,EAAE,CAAC;QAEnB,MAAM,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC,OAAO,CAAC,UAAC,SAAS;YACtC,UAAU,CAAC,SAAS,CAAC,CAAC,OAAO,CAAC,UAAC,KAAK;gBAChC,IAAI,KAAK,CAAC,MAAM,KAAK,MAAM,IAAI,CAAC,KAAK,CAAC,QAAQ,EAAE;oBAC5C,SAAS,CAAC,IAAI,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC;iBACjC;YACL,CAAC,CAAC,CAAA;QACN,CAAC,CAAC,CAAC;QAEH,OAAO,SAAS,CAAC;IACrB,CAAC;IAEM,yBAAc,GAArB;QACI,IAAM,SAAS,GAAG,UAAU,CAAC,gBAAgB,EAAE,CAAC;QAChD,OAAO,SAAS,CAAC,CAAC,CAAC,CAAC;IACxB,CAAC;IACL,iBAAC;AAAD,CAAC,AAtBD,IAsBC;AAtBY,gCAAU"}