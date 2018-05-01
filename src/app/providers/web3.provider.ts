declare const Web3;

export const web3Provider = () => {
    return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};