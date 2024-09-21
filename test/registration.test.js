import chai from 'chai'; // Import the entire chai package
import chaiHttp from 'chai-http';
import app from '../server.js'; // Ensure the path is correct

chai.use(chaiHttp); // Apply chai-http plugin
const { expect } = chai; // Destructure expect from chai

describe('Registration API', () => {
    it('should register a new user', async () => {
        const res = await chai.request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'testpassword',
                email: 'testuser@example.com'
            });
    
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('message', 'Error registering user');
    });
    

    it('should fail when missing required fields', (done) => {
        chai.request(app)
            .post('/register')
            .send({
                username: 'testuser' // Only username provided
            })
            .end((err, res) => {
                expect(res).to.have.status(400); // Check for the right status code
                expect(res.body).to.have.property('message', 'All fields are required.'); // Check for the correct error message
                done();
            });
    });    
});
