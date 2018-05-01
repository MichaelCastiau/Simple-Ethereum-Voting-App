import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class BlockChainService {
    private readonly abi: any;
    private readonly contract: any;
    private readonly contractInstance: any;
    private readonly candidates: Array<{
        name: string,
        votes: Observable<number>
    }>;

    public constructor(@Inject('web3') private readonly web3, @Inject('contractAddress') private readonly address: string) {
        this.abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]');
        this.contract = web3.eth.contract(this.abi);

        // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
        this.contractInstance = this.contract.at(this.address);
        this.candidates = [
            {name: 'Rama', votes: new BehaviorSubject<number>(this.getTotalVotes('Rama'))},
            {name: 'Nick', votes: new BehaviorSubject<number>(this.getTotalVotes('Nick'))},
            {name: 'Jose', votes: new BehaviorSubject<number>(this.getTotalVotes('Jose'))},
            {name: 'Michael', votes: new BehaviorSubject<number>(this.getTotalVotes('Michael'))},
            {name: 'Niels', votes: new BehaviorSubject<number>(this.getTotalVotes('Niels'))}
        ];
    }

    public voteForCandidate(name: string): Observable<any> {
        return Observable.create(observer => {
            this.contractInstance.voteForCandidate(name, {from: this.web3.eth.accounts[0]}, (err?) => {
                if (err) {
                    observer.error(err);
                } else {
                    (this.candidates.find(c => c.name == name).votes as BehaviorSubject<number>).next(this.getTotalVotes(name));
                    observer.next();
                    observer.complete();
                }
            });
        });
    }

    getTotalVotes(name: string): number {
        return parseInt(this.contractInstance.totalVotesFor.call(name));
    }

    getCandidates(): Array<{
        name: string,
        votes: Observable<number>
    }> {
        return this.candidates;
    }
}