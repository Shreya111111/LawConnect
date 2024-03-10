process.env.NODE_ENV = 'test'
const Prisoner = require('../models/prisoner.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Prisoners', () => {
    before((done) => {  //Before each test we empty the database
        Prisoner.deleteMany({}, (err) => {
            if (err) done(err);
            done();
        });
    });

    //Test GET for the prisoner 
    describe('/GET Prisoner', () => {
        it('GET all the Prisoners', (done) => {
            chai.request(server)
                .get('/prisoners')
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.eql([])
                    done()
                });
        });
    });

    //Test for /POST Prisoner/add
    describe('/POST Prisoner', () => {
        it('POST a Prisoner at prisoners/add', (done) => {
            const newPrisoner = new Prisoner({
                googleId: "testGoogleId"
            });

            chai.request(server)
                .post('/prisoners/add')
                .send(newPrisoner)
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
        it('PUT request to update the data', (done) => {
            chai.request(server)
            .put('/prisoners/update-phone')
            .send({
                googleId: "testGoogleId",
                phoneNumber: "test37438243280432432432",
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

    //Test for /POST Prisoner/add
    describe('/POST Prisoner', () => {
        it('POST a Prisoner at prisoners/add with a duplicate key', (done) => {
            const newPrisoner = new Prisoner({
                googleId: "testGoogleId"
            });

            chai.request(server)
                .post('/prisoners/add')
                .send(newPrisoner)
                .end((err, res) => {
                    if (err) {
                        // console.log(err);
                        done(err);
                    }
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });

    //Test GET for Prisoners
    describe('/GET Prisoner', () => {
        it('GET all the Prisoners', (done) => {
            chai.request(server)
                .get('/prisoners')
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
    
    after(function() {
        process.exit();
    })
});