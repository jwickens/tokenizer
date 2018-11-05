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

test('Tokenizer.tokenize() throws an Error when invalid input provided', () => {
  const invalidInputs = [
	{"cc_number": true},
	{"cc_number": null},
	{"cc_number": 123},
	{"ccnumber": "378282246310005"},
  ];
  const tokenizer = new Tokenizer();
  invalidInputs.forEach(invalidInput => {
	expect(() => {
		tokenizer.tokenize(invalidInput);
	}).toThrow();
  });
});

test('Tokenizer.tokenize() returns a token for valid input', () => {
	const validInputs = [
		{"cc_number": "2222111100009999"},
		{"cc_number": "4242424242424242"}, // VISA
		{"cc_number": "38520000023237"}, // JCB
		{"cc_number": "378282246310005"}, // AMEX
	];
	const tokenizer = new Tokenizer();
	validInputs.forEach(validInput => {
	  	const output = tokenizer.tokenize(validInput)
		expect(output).toBeDefined();
		expect(output).toHaveProperty('token');
		expect(typeof output.token).toBe('string');
	});
  });