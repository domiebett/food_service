"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = __importStar(require("winston"));
exports.logger = winston.createLogger();
var env = 'development';
if (env === 'development') {
    exports.logger.add(new winston.transports.Console({
        handleExceptions: true
    }));
}
process.on('unhandledRejection', function (reason, p) {
    exports.logger.warn('system level exceptions at, Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
//# sourceMappingURL=Logging.js.map

//# sourceMappingURL={"version":3,"file":"Logging.js","sourceRoot":"","sources":["Logging.ts"],"names":[],"mappings":";;;;;;;;;AAAA,+CAAmC;AAEtB,QAAA,MAAM,GAAmB,OAAO,CAAC,YAAY,EAAE,CAAC;AAC7D,IAAM,GAAG,GAAG,aAAa,CAAC;AAE1B,IAAI,GAAG,KAAK,aAAa,EAAE;IACvB,cAAM,CAAC,GAAG,CAAC,IAAI,OAAO,CAAC,UAAU,CAAC,OAAO,CAAC;QACtC,gBAAgB,EAAE,IAAI;KACzB,CAAC,CAAC,CAAC;CACP;AAED,OAAO,CAAC,EAAE,CAAC,oBAAoB,EAAE,UAAU,MAAM,EAAE,CAAC;IAChD,cAAM,CAAC,IAAI,CAAC,uEAAuE,EAAE,CAAC,EAAE,WAAW,EAAE,MAAM,CAAC,CAAC;AACjH,CAAC,CAAC,CAAC"}