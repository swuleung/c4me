const { agent } = require('../shared');
const { expect } = require('../shared');

describe('Scrape college information', () => {
    describe('Login as admin & delete colleges', () => {
        it('Login as admin test', (done) => {
            agent
                .post('/users/login')
                .send({
                    username: 'admin',
                    password: 'admin',
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

    describe('Scrape data', () => {
        it('Scrape from CollegeData.com', function scrapeCollegeData(done) {
            this.timeout(60000);
            agent
                .get('/admin/scrapeCollegeData')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Scrape from College Ranking', function scrapeCollegeRanking(done) {
            this.timeout(60000);
            agent
                .get('/admin/scrapeCollegeRanking')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Import College Scorecard', function importCollegeScorecard(done) {
            this.timeout(60000);
            agent
                .get('/admin/importCollegeScorecard')
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
                    const { college } = res.body;
                    expect(college).to.shallowDeepEqual({
                        Name: 'Stony Brook University',
                        Ranking: '105',
                        Size: 17215,
                        AdmissionRate: '42.19',
                        CostOfAttendanceInState: 27221,
                        CostOfAttendanceOutOfState: 44891,
                        Location: 'NY',
                        GPA: '3.83',
                        SATMath: 675,
                        SATEBRW: 671,
                        ACTComposite: 28,
                        InstitutionType: '1',
                        CompletionRate: '52.80',
                        StudentDebt: 19000,
                    });
                    done();
                });
        });
    });
});
