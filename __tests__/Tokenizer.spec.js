/*

POST /tokenize
{"cc_number": "2222111100009999"}

{"cc_number": "4242424242424242"} # VISA

{"cc_number": "38520000023237"} # JCB

{"cc_number": "378282246310005"} # AMEX

// invalid
{"cc_number": true}
{"cc_number": null}
{"cc_number": 123}
{"ccnumber": "378282246310005"}
<tag>i am not json</tag>

// POST /untokenize
// Assume "CCT_VALID" exists, CCT_INVALID doesn't exist in datastore

{ "payload": "{\"cc\": \"CCT_VALID\"}", "dest": {"url": "https://my.website/"}}
{ "payload": "<cc>CCT_VALID</cc>", "dest": {"url": "https://my.website/"}}

*/

const Tokenizer = require('../src/Tokenizer');

test('Tokenizer.tokenize() throws an Error when invalid input provided', async () => {
  const invalidInputs = [
	{"cc_number": true},
	{"cc_number": null},
	{"cc_number": 123},
	{"ccnumber": "378282246310005"},
  ];
  const tokenizer = new Tokenizer();
  let errors = 0
  const promises = invalidInputs.map(async invalidInput => {
      try {
		await tokenizer.tokenize(invalidInput);
      } catch (err) {
          errors += 1
      }
  });
  await Promise.all(promises)
  expect(errors).toBe(invalidInputs.length)
});

test('Tokenizer.tokenize() returns a token for valid input and appropriately untokenizes', async () => {
  // tokenize valid credit card numbers
	const validInputs = [
		{"cc_number": "2222111100009999"},
		{"cc_number": "4242424242424242"}, // VISA
		{"cc_number": "38520000023237"}, // JCB
		{"cc_number": "378282246310005"}, // AMEX
	];
	const tokenizer = new Tokenizer();
	const promises = validInputs.map(async validInput => {
    const output = await tokenizer.tokenize(validInput)
    expect(output).toBeDefined();
    expect(output).toHaveProperty('token');
    expect(typeof output.token).toBe('string');
    expect(output.token).toHaveLength(20);
  });
  await Promise.all(promises);
  // ensure tokenizer.tokens correctly seeded w/ cc number inputs
  const creditCardNumbers = validInputs.map(validInput => validInput.cc_number);
  expect(creditCardNumbers).toEqual(Object.values(tokenizer.tokens));
  // ensure untokenize maps to inputed cc numbers
  Object.keys(tokenizer.tokens).forEach(token => {
    const creditCardNumber = tokenizer.untokenize(token);
    expect(creditCardNumbers).toContain(creditCardNumber);
  });
});
