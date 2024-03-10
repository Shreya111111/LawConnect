process.env.NODE_ENV = 'test'
const Lawyer = require('../models/lawyer.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Lawyers', () => {
    before((done) => {  //Before each test we empty the database
        Lawyer.deleteMany({}, (err) => {
            if (err) done(err);
            done();
        });
    });

    //Test GET for Lawyers
    describe('/GET Lawyer', () => {
        it('GET all the Lawyers', (done) => {
            chai.request(server)
                .get('/lawyers')
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }
                    expect(res).to.have.status(200);
                    expect(res.body).to.eql([]);
                    done();
                });
        });
    });

    //Test for /POST
    describe('/POST Lawyer', () => {
        it('POST a Lawyer at lawyers/add', (done) => {
            const newLawyer = new Lawyer({
                username: "testUsername",
                password: "testPassword"
            });

            chai.request(server)
                .post('/lawyers/add')
                .send(newLawyer)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    done();
                });
        });
    });

    describe('/PUT', () => {
        it('PUT request to update the lawyer data', (done) => {
            chai.request(server)
            .put('/lawyers/update')
            .send({
                username: "testUsername",
                phoneNumber: "test37438243280432432432",
                specialization: "testSpecialization",
                feesPerSession: "testfeesPerSessionTest"
            })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    done(err)
                }
                expect(res).to.have.status(200)
                done();
            });
        })
    })

    // Test to add a lawyer with duplicate key
    describe('/POST Lawyer', () => {
        it('POST a lawyer at lawyers/add with a duplicate key', (done) => {
            const newLawyer = new Lawyer({
                username: "testUsername"
            });

            chai.request(server)
                .post('/lawyers/add')
                .send(newLawyer)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }
                    expect(res).to.have.status(400)
                    done();
                });
        });
    });

    //Test GET for Lawyers
    describe('/GET Lawyer', () => {
        it('GET all the Lawyers', (done) => {
            chai.request(server)
                .get('/lawyers')
                .end((err, res) => {
                    if (err) {
                        console.log(err)
                        done(err);
                    }
                    expect(res).to.have.status(200);
                    expect(res.body.length).eql(1);
                    done()
                });
        });
    });
    
});