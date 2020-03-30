const agent = require('../shared').agent;
const expect = require('../shared').expect;

describe("Scrape college information", () => {
    describe("Login as admin & delete colleges", () => {
        it('Login as admin test', (done) => {
            agent
                .post('/users/login')
                .send({
                    'username': 'admin',
                    'password': 'admin',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.cookie('access_token');
                    done();
                });
        });

        it('Delete all colleges', (done) => {
            agent
                .delete('/admin/deleteAllColleges')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("Scrape data", () => {
        it('Scrape from CollegeData.com', function (done) {
            this.timeout(30000)
            agent
                .get('/admin/scrapeCollegeData')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Scrape from College Ranking', function (done) {
            this.timeout(30000)
            agent
                .get('/admin/scrapeCollegeRanking')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Verify College Data and College Ranking', (done) => {
            agent
                .get('/colleges/name/Stony Brook University')
                .end((err, res) => {
                    res.should.have.status(200);
                    let college = res.body.college;
                    expect(college.Name).to.equal('Stony Brook University');
                    expect(college.Ranking).to.equal('=105'); // change this to 105
                    expect(college.Size).to.equal(17364);
                    expect(college.AdmissionRate).to.equal(42);
                    expect(college.CostOfAttendanceInState).to.equal(27221);
                    expect(college.CostOfAttendanceOutOfState).to.equal(44891);
                    expect(parseFloat(college.GPA)).to.equal(3.83);
                    expect(college.SATMath).to.equal(675);
                    expect(college.SATEBRW).to.equal(671);
                    expect(college.ACTComposite).to.equal(28);
                    expect(college.CompletionRate).to.equal(53); // change this to 52.8
                    done();
                });
        });
    });
});