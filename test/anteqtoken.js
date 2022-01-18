const AnteqToken = artifacts.require('./AnteqToken.sol');

contract('AnteqToken', (accounts) => {

  let anteqTokenInstance;

  before(async()=>{
    anteqTokenInstance = await AnteqToken.new();

  })

  it('Should name to "AnteqToken".', async () => {
    const name = await anteqTokenInstance.name();
    assert.equal(name, 'AnteqToken', 'The name was not "AnteqToken".');
  });
});
