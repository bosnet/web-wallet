import sebakjs from 'sebakjs-util';

const makeFullISOString = (str) => {
  return str.slice(0, str.length - 1) + '000000' + str.slice(str.length - 1 + Math.abs(0));
};

const makeRLPData = (type, body) => {

  if (type === 'payment') {
    const tx = [
      body.source,
      body.fee,
      Number(body.sequence_id),
      [[
        [body.operations[0].H.type],
        [body.operations[0].B.target, body.operations[0].B.amount],
      ]],
    ];
    return tx;
  }

  const tx = [
    body.source,
    body.fee,
    Number(body.sequence_id),
    [[
      [body.operations[0].H.type],
      [body.operations[0].B.target, body.operations[0].B.amount, ''],
    ]],
  ];

  return tx;
};

const makeTransaction = (keypair, target, amount, type, lastSequenceId) => {
  let HType = 'payment';
  if (type === 'create') HType = 'create-account';

  const body = {
    T: 'transaction',
    H: {
      version: '1',
      created: makeFullISOString(new Date().toISOString()),
      // 'hash': '2g3ZSrEnsUWeX5Mxz5uTh2b4KVpVQS7Ek2HzZd759FHn',
      // 'signature': '3oWmCMNHExRQnZVEBSH16ZBgLE6ayz7t1fsjzTjAB6WpXMpkDJbhcL8KudqFFG21XmfSXnJH1BLhnBUh4p68yFeR'
    },
    B: {
      source: keypair.publicKey(),
      fee: String('10000'),
      sequence_id: (Number(lastSequenceId)),
      operations: [
        {
          H: {
            type: HType,
          },
          B: {
            target,
            amount: (amount * 10000000).toFixed(0),
            // linked: '',
          },
        },
      ],
    },
  };


  const nid = process.env.NETWORK_ID;

  const RDPData = makeRLPData(HType, body.B);
  const hash = sebakjs.hash(RDPData);
  const sig = sebakjs.sign(hash, nid, keypair.secret());

  body.H.hash = hash;
  body.H.signature = sig;

  return fetch(`${process.env.API_URL}/api/v1/transactions`, {
    method: 'POST',
    timeout: 3000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
};

export default makeTransaction;
