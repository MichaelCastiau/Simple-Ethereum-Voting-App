const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const path = require('path');
//Create the Web3 interaction necessary to communicate with the blockchain
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log("Account active at the moment", web3.eth.accounts);

const myContract = new Promise((resolve, reject) => fs.readFile(path.join(__dirname, 'Voting.sol'), (err, data) => {
    err ? reject(err) : resolve(data.toString())
}));


async function compileMyCode(){
    const myCode = await myContract;
    return solc.compile(myCode);
}

function getContract(name, compiledCode) {
    const abiDefinition = JSON.parse(compiledCode.contracts[`:${name}`].interface);
    return {
        'abiDefinition' : abiDefinition,
        'contract' :web3.eth.contract(abiDefinition),
        'byteCode' : compiledCode.contracts[`:${name}`].bytecode
    }
}


console.info('Compiling code...');
compileMyCode()
    .then(compiledCode => {
        console.info('Code successfully compiled! =)');

        const VotingContract = getContract('Voting', compiledCode);
        VotingContract.contract.new(['Rama','Nick','Jose', 'Michael', 'Niels'], {data: VotingContract.byteCode, from: web3.eth.accounts[0], gas: 4700000}, (err, deployedContract) => {
            if(err){
                console.error('Cannot deploy contract!');
                return console.error(err);
            }

            console.info('Voting contract deployed, address:', deployedContract.address);
            const contractInstance = VotingContract.contract.at(deployedContract.address);
        });


    })
    .catch(err => {
        console.error('Could not compile code!!');
        console.error(err);
    });
