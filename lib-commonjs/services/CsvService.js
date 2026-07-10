"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvService = void 0;
var tslib_1 = require("tslib");
var CsvService = /** @class */ (function () {
    function CsvService() {
    }
    CsvService.prototype.exportToCsv = function (headers, rows, filename) {
        var bom = '\uFEFF';
        var escape = function (field) {
            if (field.indexOf(';') !== -1 ||
                field.indexOf('"') !== -1 ||
                field.indexOf('\n') !== -1) {
                return '"' + field.replace(/"/g, '""') + '"';
            }
            return field;
        };
        var csvContent = bom +
            tslib_1.__spreadArray([
                headers.map(escape).join(';')
            ], rows.map(function (r) { return r.map(escape).join(';'); }), true).join('\n');
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return CsvService;
}());
exports.CsvService = CsvService;
//# sourceMappingURL=CsvService.js.map