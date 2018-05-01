import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BlockChainService} from '../services/block-chain.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-candidates-list',
    templateUrl: 'candidates.component.html',
    styleUrls: ['./candidates.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatesComponent implements OnInit {
    public candidates: Array<{
        name : string,
        votes : Observable<number>
    }>;

    public constructor(private blockChain: BlockChainService) {
    }

    ngOnInit(): void {
        this.candidates = this.blockChain.getCandidates();
    }
}