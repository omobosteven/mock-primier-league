import 'dotenv/config';
import Helper from '../helpers/Helper';

const {
    hashPassword,
    comparePassword,
    replaceWhiteSpacesWithHyphen,
    removeExtraWhiteSpaces,
    verifyMongooseObjectId
} = Helper;

let password;

describe('Test helper functions', () => {
    beforeAll(async () => {
        const hashedPassword = await hashPassword('testpass');

        password = hashedPassword;
    });

    it('should hash a password', async (done) => {
        const hashedPassword = await hashPassword('testpass');

        expect(hashedPassword).not.toBe('testpass');
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

    it('should replace white spaces between text with hyphen', (done) => {
        const team = 'manchester   united ';
        const trimmedTeam = replaceWhiteSpacesWithHyphen(team);

        expect(trimmedTeam).toBe('manchester-united');
        done();
    });

    it('should do nothing if payload is not string', (done) => {
        const team = 1234;
        const trimmedTeam = replaceWhiteSpacesWithHyphen(team);

        expect(trimmedTeam).toBe(1234);
        done();
    });

    it('should remove extra white spaces between text', (done) => {
        const payload = {
            name: 'test         me',
            capacity: 2345,
            code: '   test    '
        };
        const trimmedPayload = removeExtraWhiteSpaces(payload);

        expect(trimmedPayload.name).toBe('test me');
        expect(trimmedPayload.code).toBe('test');
        expect(trimmedPayload.capacity).toBe(2345);
        done();
    });

    it('should return undefined if ObjectId is not valid', (done) => {
        const id = '12345fdbdmfndn';

        const documentId = verifyMongooseObjectId(id);

        expect(documentId).toBeUndefined();
        done();
    });
});
