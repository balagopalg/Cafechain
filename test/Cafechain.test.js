const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const compiledcafeChain = require('../build/cafeChain.json');

let accounts;
let factory;
let cafeChainAddress;
let cafeChain;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  
  [cafeChainAddress] = await factory.methods.getDeployedcafeChains().call();
  cafeChain = await new web3.eth.Contract(
    JSON.parse(compiledcafeChain.interface),
    cafeChainAddress
  );
});

describe('cafeChains', () => {
  
  it('marks caller as the cafeChain manager', async () => {
    const manager = await cafeChain.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await cafeChain.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await cafeChain.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires value of product', async () => {
    try {
      await cafeChain.methods.contribute().send({
        value: 'value',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await cafeChain.methods
      .createRequest('Ice Tea', '10', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await cafeChain.methods.requests(0).call();

    assert.equal('Ice Tea', request.description);
  });

  it('processes requests', async () => {
    await cafeChain.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await cafeChain.methods
      .createItem('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await cafeChain.methods.selectItem(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await cafeChain.methods.transfer(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});