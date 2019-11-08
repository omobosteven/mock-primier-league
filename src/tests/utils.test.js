import 'dotenv/config';
import Utils from '../utilities/utils';

let comparePassword;

describe('Test util functions', () => {
    beforeAll(async () => {
        const password = 'testpass';
        const hashedPassword = await Utils.hashPassword(password);

        comparePassword = hashedPassword;
    });

    it('should generate token', (done) => {
        const token = Utils.generateToken({
            user: 12345,
            admin: false
        });

        expect(token).toBeDefined();
        done();
    });

    it('should hash a password', async (done) => {
        const password = 'testpass';
        const hashedPassword = await Utils.hashPassword(password);

        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword).toBeTruthy();
        done();
    });

    it('should return true if passwords matches', async (done) => {
        const password = 'testpass';
        const checkedPassword = await Utils.comparePassword(password, comparePassword);

        expect(checkedPassword).toBe(true);
        done();
    });

    it('should return false if passwords don\'t match', async (done) => {
        const password = 'testpasses';
        const checkedPassword = await Utils.comparePassword(password, comparePassword);

        expect(checkedPassword).toBe(false);
        done();
    });
});
