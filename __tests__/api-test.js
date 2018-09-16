const supertest = require('supertest');
const createApp = require('../src/api/api');

const tmp = require('tmp');
const path = require('path');
const fs = require('fs');

let app;

beforeEach(() => {
    const tmpdir = tmp.dirSync();
    const dbPath = path.join(tmpdir.name, 'names.db');

    fs.createReadStream('__tests__/test.db').pipe(fs.createWriteStream(dbPath));
    app = createApp(dbPath);
});

describe('add new name API', () => {
    test('should fail add new name if no needle', (done) => {
        supertest(app)
            .post('/api/add')
            .expect(400, done);
    });

    test('should add name in db', (done) => {
        supertest(app)
            .post('/api/add')
            .send({
                needle: 'joan'
            })
            .expect(function (res) {
                expect(res.body).toEqual({
                    _id: 'joan',
                    name: 'Joan'
                });
            })
            .expect(200, done);

    });
});

describe('name search API', () => {
    test('should fail search if no needle', (done) => {
        supertest(app)
            .post('/api/search')
            .expect(400, done);
    });

    test("should search names", (done) => {
        supertest(app)
            .post('/api/search')
            .send({
                needle: 'me'
            })
            .expect(function (res) {
                expect(res.body).toEqual({
                    "groups": [{
                        "title": "C",
                        "names": ["Clemencia", "Clemensia", "Clement", "Clementine", "Clementius"],
                        "count": 5
                    }, {
                        "title": "M",
                        "names": ["Meliora", "Merc", "Mercury", "Merida"],
                        "count": 4
                    }],
                    "count": 9
                });
            })
            .expect(200, done);
    });

    test("should return empty search result", (done) => {
        supertest(app)
            .post('/api/search')
            .send({
                needle: 'mes'
            })
            .expect(function (res) {
                expect(res.body).toEqual({
                    "groups": [],
                    "count": 0
                });
            })
            .expect(200, done);
    });
});
