import { handler as orig } from './hello';
import { wrapHandlerFn } from '../testing/wrapHandlerFn';

const handler = wrapHandlerFn(orig);

describe('Hello handler', () => {
    it('should greet user', async () => {
        const result = await handler({ pathParameters: { name: 'James' } });
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello James',
            }),
        });
    });

    it('should greet unknown users', async () => {
        const result = await handler({});
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello World',
            }),
        });
    });
});
