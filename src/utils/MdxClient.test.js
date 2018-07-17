// Component under test
const MdxClient = require('./MdxClient');

describe('yyyymmddToMemberKey', () => {
  test("yyyymmddToMemberKey should return a 'YYYYMM' formatted string", () => {
    const expected = '199505';
    const result = MdxClient(null, null, null).yyyymmddToMemberKey('1995/05/01');

    expect(expected).toEqual(result);
  });
});

describe('memberKeyToYYYYMMDD', () => {
  test("memberKeyToYYYYMMDD should return a 'YYYY/MM/DD' formatted string", () => {
    const expected = '1995/05/01';
    const result = MdxClient(null, null, null).memberKeyToYYYYMMDD('199505');

    expect(expected).toEqual(result);
  });
});
