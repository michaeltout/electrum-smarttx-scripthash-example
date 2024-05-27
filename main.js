const bitgo = require('@bitgo/utxo-lib');
const ElectrumClient = require('@keep-network/electrum-client-js')
const { fromBase58Check } = require('verus-typescript-primitives')

const R_ADDRESS = "PUT_R_ADDRESS_HERE";

async function main() {
  const client = new ElectrumClient(
    'el0.veruscoin.io',
    17485,
    'tcp'
  )

  const addrbytes = fromBase58Check(R_ADDRESS).hash.toString('hex');

  try {
    await client.connect(
      'electrum-client-js',
      '1.4.2'
    )

    const script = `050403000000cc1a040300010114${addrbytes}75`
    const hash = bitgo.crypto.sha256(Buffer.from(script, 'hex'));
    const reversedHash = Buffer.from(hash.reverse());

    const smarttxUtxos = await client.blockchain_scripthash_listunspent(reversedHash.toString('hex'));
    const smarttxBalance = await client.blockchain_scripthash_getBalance(reversedHash.toString('hex'));
    
    console.log(smarttxUtxos)
    console.log(smarttxBalance)

    await client.close()
  } catch (err) {
    console.error(err)
  }
}

main()