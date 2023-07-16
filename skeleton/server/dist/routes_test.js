"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var routes_1 = require("./routes");
var httpMocks = __importStar(require("node-mocks-http"));
describe('routes', function () {
    it('createDraft', function () {
        // tests a simple create
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { draftID: 1, drafters: ["marco", "woo"], rounds: 1, options: ["poo", "butt"] } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.createDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), 'Draft Created');
    });
    it('createDraft invalid draftID', function () {
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { draftID: 0, drafters: ["marco", "woo"], rounds: 1, options: ["poo", "butt"] } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.createDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });
    it('createDraft invalid drafters', function () {
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { draftID: 0, drafters: [], rounds: 1, options: ["poo", "butt"] } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.createDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });
    it('createDraft invalid options', function () {
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { draftID: 0, drafters: ["marco", "woo"], rounds: 1, options: [] } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.createDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });
    it('createDraft invalid rounds', function () {
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { draftID: 1, drafters: ["marco", "woo"], rounds: 0, options: ["poo", "butt"] } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.createDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyxtQ0FBb0M7QUFDcEMseURBQTZDO0FBRzdDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFZixFQUFFLENBQUMsYUFBYSxFQUFFO1FBQ2Qsd0JBQXdCO1FBQ3hCLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDaEssSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUEsb0JBQVcsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDOUIsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENB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