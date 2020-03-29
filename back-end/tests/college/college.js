// TODO 
const agent = require('../shared').agent;
const expect = require('../shared').expect;

describe("College", () => {
    describe("Checks college table", () => {
        it('get all colleges', (done) => {
            agent
                .get('/colleges/all')
                .end((err,res) => {
                    res.should.have.status(200);
                    console.log(res);
                    done();
                })
        })
    });

    describe(" Get college by id", () =>{
        it ("get college with id = 1", (done) => {
            agent
                .get('colleges/1')
                .end((err, res) => {
                    console.log("\n\n\n\n\n\n\n\n\n\n");
                    console.log(res);
                    console.log("\n\n\n\n\n\n\n\n\n\n");
                    res.should.have.status(200);
                    done();
                })
        })

        it ("get invalid college with id = -1", (done) => {
            agent
            .get('colleges/-11')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
        })
    })


});
