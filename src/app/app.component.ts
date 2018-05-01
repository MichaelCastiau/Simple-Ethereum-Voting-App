import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlockChainService} from './services/block-chain.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    public votingForm: FormGroup;
    public candidates: Array<{
        name: string,
        votes: Observable<number>
    }>;

    public constructor(private formBuilder: FormBuilder, private blockChain: BlockChainService) {
    }

    ngOnInit(): void {
        this.votingForm = this.formBuilder.group({
            'candidate': ['', [Validators.required]]
        });
        this.candidates = this.blockChain.getCandidates();
    }

    vote(): void {
        if (this.votingForm.invalid)
            return alert('Please insert a candidate!');

        const name = this.votingForm.get('candidate').value;
        console.log(`Voting for ${name}`);
        this.blockChain.voteForCandidate(name)
            .subscribe(() => {
                console.info('SUCCESS');
            }, (err) => {
                alert('Problem Voting!');
            });
    }
}
