"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
var port = 8088;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post("/api/create", routes_1.createDraft);
app.post("/api/join", routes_1.joinDraft);
app.post("/api/pick", routes_1.pick);
app.post("/api/getStatus", routes_1.getStatus);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBOEI7QUFDOUIsbUNBQW1FO0FBQ25FLDREQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLElBQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG9CQUFXLENBQUMsQ0FBQztBQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBUyxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsYUFBSSxDQUFDLENBQUM7QUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBUyxDQUFDLENBQUM7QUFDdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQXVCLElBQUksQ0FBRSxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQyJ9