const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Find Similar High Schools', () => {
    it('Check if high school exists in db', (done) => {
        agent
            .get('/highSchools/name/Santa Monica High School')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('Login to user', (done) => {
        agent
            .post('/users/login')
            .send({
                username: 'mocha4',
                password: 'bob!pass1',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.cookie('access_token');
                done();
            });
    });

    it('Update student with new high school', function updateStudent(done) {
        this.timeout(15000);
        agent
            .post('/students/mocha4/edit')
            .send({
                student: { GPA: 3.0 },
                highSchool: {
                    Name: 'Santa Monica High School',
                    HighSchoolCity: 'Santa Monica',
                    HighSchoolState: 'CA',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                setTimeout(() => {
                    const { student } = res.body;
                    expect(student.username).to.equal('mocha4');
                    done();
                }, 5000);
            });
    });

    it('Check if new high school was scraped', (done) => {
        agent
            .get('/highSchools/name/Santa Monica High School')
            .end((err, res) => {
                res.should.have.status(200);
                const { highSchool } = res.body;
                expect(highSchool.Name).to.equal('Santa Monica High School');
                done();
            });
    });

    it('Get similar high schools list', (done) => {
        agent
            .get('/highSchools/findSimilarHS/mocha4')
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                expect(res.body.highSchools).to.shallowDeepEqual([{
                    Name: 'Ridgewood High School',
                    HighSchoolCity: 'Ridgewood',
                    HighSchoolState: 'NJ',
                    NicheAcademicScore: 'A+',
                    GraduationRate: 97,
                    AverageSAT: 1320,
                    SATMath: 670,
                    SATEBRW: 650,
                    AverageACT: 30,
                    ACTMath: 29,
                    ACTEnglish: 30,
                    ACTReading: 30,
                    ACTScience: 29,
                    similarityPoints: 37,
                }]);
                done();
            });
    });
});
