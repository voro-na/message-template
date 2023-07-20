const YourClass = require('./generateTemplateStore');

jest.mock('./generateTemplateStore');

describe('YourClass', () => {
    let state;

    beforeEach(() => {
        state = YourClass.default; // Create a new state of the class for each test
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    test('generateFinalTemplate should return the final template', () => {
        // Set up initial values
        state.template = [['Hello, {name}!']];
        state.valueOfVariables = {};


        const result = state.generateFinalTemplate('Alice', 'name');

        expect(result).toEqual('Hello, Alice! ');
    });

    test('generateFinalTemplate should handle "if" and "else" conditions correctly', () => {
        // Set up initial values
        state.template = [
            ['{var1}', 'if', '1'],
            ['{var1}', 'then', '2'],
            ['{var2}', 'else', '3'],
        ];
        state.valueOfVariables = { var1: 'Value1', var2: 'Value2' };

        const result = state.generateFinalTemplate('', 'var1');

        expect(result).toEqual('Value2 ');
    });

    test('generateFinalTemplate should handle "then" conditions correctly', () => {
        // Set up initial values
        state.template = [
            ['{var1}', 'if', '1'],
            ['{var1}', 'then', '2'],
            ['{var2}', 'else', '3'],
        ];
        state.valueOfVariables = { var1: 'Value1', var2: 'Value2' };

        const result = state.generateFinalTemplate('', 'var1');

        expect(result).toEqual('Value2 ');
    });
});
