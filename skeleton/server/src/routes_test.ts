import * as assert from 'assert';
import {createDraft, Draft, joinDraft, pick, getStatus} from './routes'
import * as httpMocks from 'node-mocks-http';


describe('routes', function() {

    it('createDraft', function() {
        // tests a simple create
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 1 ,drafters: ["marco", "woo"],rounds: 1, options: ["poo", "butt"] }});
        const res1 = httpMocks.createResponse();
        createDraft(req1, res1);
        const draft: Draft = {drafters: ["marco", "woo"], 
            draftID: 1, 
            rounds: 1, 
            options: ["poo", "butt"], 
            currPicks: {roundList: [], picks: [], drafterHistory: []}, 
            currDrafter: "marco",
            nextDrafter: ""};
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), draft);
    });

    it('createDraft invalid draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: 0 ,drafters: ["marco", "woo"],rounds: 1, options: ["poo", "butt"] }});
        const res1 = httpMocks.createResponse();
        createDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('createDraft invalid drafters', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: 0 ,drafters: [],rounds: 1, options: ["poo", "butt"] }});
        const res1 = httpMocks.createResponse();
        createDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('createDraft invalid options', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: 0 ,drafters: ["marco", "woo"], rounds: 1, options: [] }});
        const res1 = httpMocks.createResponse();
        createDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('createDraft invalid rounds', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: 1 ,drafters: ["marco", "woo"],rounds: 0, options: ["poo", "butt"] }});
        const res1 = httpMocks.createResponse();
        createDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('joinDraft', function() {
        // tests a simple join
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 1}});
        const res1 = httpMocks.createResponse();
        joinDraft(req1, res1);
        const draft: Draft = {drafters: ["marco", "woo"], 
            draftID: 1, 
            rounds: 1, 
            options: ["poo", "butt"], 
            currPicks: {roundList: [], picks: [], drafterHistory: []}, 
            currDrafter: "marco",
            nextDrafter: ""};
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), draft);
    });

    it('joinDraft invalid draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: -1}});
        const res1 = httpMocks.createResponse();
        joinDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('joinDraft non-existing draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 2}});
        const res1 = httpMocks.createResponse();
        joinDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('joinDraft invalid drafter', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: 2, draftID: 1}});
        const res1 = httpMocks.createResponse();
        joinDraft(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('pick', function() {
        // tests a simple join
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 1, pick: "poo"}});
        const res1 = httpMocks.createResponse();
        pick(req1, res1);
        const draft: Draft = {drafters: ["marco", "woo"], 
            draftID: 1, 
            rounds: 1, 
            options: ["butt"], 
            currPicks: {roundList: [1], picks: ["poo"], drafterHistory: ["marco"]}, 
            currDrafter: "woo",
            nextDrafter: "marco"};
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), {currDrafter: draft.currDrafter,
            nextDrafter: draft.nextDrafter,
            currOptions: draft.options,
            picks: draft.currPicks.picks,
            drafterHistory: draft.currPicks.drafterHistory,
            currRound: draft.currPicks.roundList});
    });

    it('pick invalid draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: -1}});
        const res1 = httpMocks.createResponse();
        pick(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('pick non-existing draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 2}});
        const res1 = httpMocks.createResponse();
        pick(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('pick invalid drafter', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: 2, draftID: 1}});
        const res1 = httpMocks.createResponse();
        pick(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('getStatus', function() {
        // tests a simple join
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {drafter: "marco", draftID: 1}});
        const res1 = httpMocks.createResponse();
        getStatus(req1, res1);
        const draft: Draft = {drafters: ["marco", "woo"], 
            draftID: 1, 
            rounds: 1, 
            options: ["butt"], 
            currPicks: {roundList: [1], picks: ["poo"], drafterHistory: ["marco"]}, 
            currDrafter: "woo",
            nextDrafter: "marco"};
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), {draft: draft,
            nextDrafter: draft.nextDrafter, 
            currDrafter: draft.currDrafter,
            currOptions: draft.options,
            picks: draft.currPicks.picks,
            drafterHistory: draft.currPicks.drafterHistory,
            currRound: draft.currPicks.roundList});
    });

    it('getStatus invalid draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: -1}});
        const res1 = httpMocks.createResponse();
        getStatus(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });

    it('getStatus non-existing draftID', function() {
        const req1 = httpMocks.createRequest({method: 'POST', url: '/api/create', body: {draftID: 2}});
        const res1 = httpMocks.createResponse();
        getStatus(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
    });
  
});


