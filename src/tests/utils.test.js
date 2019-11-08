import 'dotenv/config';
import Helper from '../helpers/Helper';

const {
    hashPassword,
    comparePassword,
    generateToken
} = Helper;

let password;

describe('Test util functions', () => {
    beforeAll(async () => {
        const hashedPassword = await hashPassword('testpass');

        password = hashedPassword;
    });

    it('should generate token', (done) => {
        const token = generateToken({
            user: 12345,
            admin: false
        });

        expect(token).toBeDefined();
        done();
    });

    it('should hash a password', async (done) => {
        const hashedPassword = await hashPassword('testpass');

        expect(hashedPassword).not.toBe('testpass');
        expect(hashedPassword).toBeTruthy();
        done();
    });

    it('should return true if passwords matches', async (done) => {
        const checkedPassword = await comparePassword('testpass', password);

        expect(checkedPassword).toBe(true);
        done();
    });

    it('should return false if passwords don\'t match', async (done) => {
        const checkedPassword = await comparePassword('testpasses', password);

        expect(checkedPassword).toBe(false);
        done();
    });
});
