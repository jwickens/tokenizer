const cryptoRandomString = require('crypto-random-string');

const TOKEN_RE = /CCT_\w{16}/
class Tokenizer {
  constructor () {
    this.tokens = {}
  }
  
  async tokenize ({cc_number: creditCardNumber}) {
    if (!creditCardNumber || typeof creditCardNumber !== 'string') {
      throw new Error('expected credit card number to be a string got ' + creditCardNumber)
    }
    const token = createToken()
    this.tokens[token] = creditCardNumber
    return { token }
  }

  untokenize (payload) {
    // note will need diff solution for async storage
    return payload.replace(TOKEN_RE, (match) => {
      return this.tokens[match]
    })
  }
}

module.exports = Tokenizer

function createToken () {
  return `CCT_${cryptoRandomString(16)}`
}
