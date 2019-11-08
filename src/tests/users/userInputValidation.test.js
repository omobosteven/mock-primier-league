import UserInputValidation from '../../middlewares/validations/userValidation';

describe('Test user signup/login input validation', () => {
    it('should call next function if signup validation passes', async (done) => {
        const req = {
            body: {
                username: 'test',
                password: '123456'
            }
        };
        const next = jest.fn();
        const res = {};

        await UserInputValidation.validateSignupInput(req, res, next);
        expect(next).toHaveBeenCalled();
        done();
    });

    it('should call next function if login validation passes', async (done) => {
        const req = {
            body: {
                username: 'test',
                password: '123456'
            }
        };

        const next = jest.fn();
        const res = {};

        await UserInputValidation.validateLoginInput(req, res, next);
        expect(next).toHaveBeenCalled();
        done();
    });
});
