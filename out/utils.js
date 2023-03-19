"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocumentSymbol = exports.isDocumentSymbol = void 0;
const config_1 = require("./config");
/**
 * Got "SymbolKind" and returns "true" if this kind is supported for us.
 * Returns "false" otherwise.
 *
 * @param value SymbolKind which should be exist in our supported list of kinds
 * @param languageId supported language id
 */
function isKindSupported(value, languageId) {
    const kinds = config_1.supportedKinds.get(languageId);
    if (kinds) {
        return kinds.some(kind => value === kind);
    }
    return false;
}
/**
 * I'm not sure what is that.
 * Testing told me we always get DocumentSymbol only. So let's work only with it.
 *
 * @param symbol idk why SymbolInformation is here. Never seen that.
 */
function isDocumentSymbol(symbol) {
    return Boolean(symbol.children);
}
exports.isDocumentSymbol = isDocumentSymbol;
/**
 * Get DocumentSymbol here, recursively call this function
 * on DocumentSymbol's children and return flatten array of them.
 */
function parseDocumentSymbol(symbol, languageId) {
    const { kind, range, children, name } = symbol;
    const data = [];
    if (isKindSupported(kind, languageId)) {
        data.push({ kind, range, name });
    }
    children.forEach(child => data.push(...parseDocumentSymbol(child, languageId)));
    return data;
}
exports.parseDocumentSymbol = parseDocumentSymbol;
//# sourceMappingURL=utils.js.map