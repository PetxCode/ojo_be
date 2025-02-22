"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffDuty = exports.HTTP = void 0;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 201] = "CREATED";
    HTTP[HTTP["BAD_REQUEST"] = 404] = "BAD_REQUEST";
})(HTTP || (exports.HTTP = HTTP = {}));
var staffDuty;
(function (staffDuty) {
    staffDuty["VICE_PRINCIPAL"] = "vice principal, ";
    staffDuty["PRINCIPAL"] = "principal";
    staffDuty["TEACHER"] = "teacher";
})(staffDuty || (exports.staffDuty = staffDuty = {}));
