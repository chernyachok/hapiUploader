var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var FileSystem = require('./fileSystem');
var _a = require('./utils'), workingUrl = _a.workingUrl, getApi = _a.getApi;
var ClientError = require('../constants').ClientError;
var FileController = /** @class */ (function () {
    function FileController(fileModel, pathToImgs) {
        this._fileModel = fileModel;
        this._fileSystem = new FileSystem(pathToImgs);
    }
    //private
    FileController.prototype.handleFileUpload = function (file, h) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, data, isExist, url, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        filename = file.hapi.filename;
                        data = file._data;
                        isExist = this._fileSystem.isExist(filename);
                        if (isExist)
                            return [2 /*return*/, h.badRequest(ClientError.fileAlreadyExists)];
                        return [4 /*yield*/, this._fileSystem.writeFile(filename, data)];
                    case 1:
                        _a.sent();
                        url = workingUrl('/files/' + filename);
                        return [4 /*yield*/, this._fileModel.create({
                                filename: filename,
                                url: url
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, h.response({ message: 'file uploaded succcesfully' }).code(201)];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, h.badImplementation()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileController.prototype.getListOfFiles = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var files, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(req._core.registrations);
                        return [4 /*yield*/, this._fileModel.findAll()];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, h.response(files).code(200)];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, h.badImplementation()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileController.prototype.getViewOfListOfFiles = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, files, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = workingUrl('/files');
                        return [4 /*yield*/, getApi(url)];
                    case 1:
                        data = _a.sent();
                        files = getHtmlString(data);
                        return [2 /*return*/, h.response(files)
                                .type('text/html')
                                .code(200)];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, h.badImplementation()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileController.prototype.saveLogo = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var logo;
            return __generator(this, function (_a) {
                logo = req.payload.logo;
                return [2 /*return*/, this.handleFileUpload(logo, h)];
            });
        });
    };
    FileController.prototype.saveJob = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = req.payload.file;
                return [2 /*return*/, this.handleFileUpload(file, h)];
            });
        });
    };
    FileController.prototype.updateFile = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, newFilename, response, newUrl, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.payload, id = _a.id, newFilename = _a.newFilename;
                        return [4 /*yield*/, this._fileModel.findOne({ where: { id: id } })];
                    case 1:
                        response = _b.sent();
                        if (response === null) {
                            return [2 /*return*/, h.badRequest(ClientError.fileNotExists)];
                        }
                        return [4 /*yield*/, this._fileSystem.renameFile(response.dataValues.filename, newFilename)];
                    case 2:
                        _b.sent();
                        newUrl = workingUrl('/files/' + newFilename);
                        return [4 /*yield*/, this._fileModel.update({ filename: newFilename, url: newUrl }, { where: { id: id } })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, h.response({ message: 'updated successfully' }).code(200)];
                    case 4:
                        err_4 = _b.sent();
                        return [2 /*return*/, h.badImplementation()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileController.prototype.deleteFile = function (req, h) {
        return __awaiter(this, void 0, void 0, function () {
            var id, response, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        id = req.payload.id;
                        return [4 /*yield*/, this._fileModel.findOne({ where: { id: id } })];
                    case 1:
                        response = _a.sent();
                        if (response === null) {
                            return [2 /*return*/, h.badRequest(ClientError.fileNotExists)];
                        }
                        return [4 /*yield*/, this._fileSystem.removeFile(response.dataValues.filename)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._fileModel.destroy({ where: { id: id } })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, h.response({ message: 'deleted successfully' }).code(200)];
                    case 4:
                        err_5 = _a.sent();
                        return [2 /*return*/, h.badImplementation()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FileController;
}());
module.exports = FileController;
