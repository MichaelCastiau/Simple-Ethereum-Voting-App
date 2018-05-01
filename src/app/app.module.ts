import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CandidatesComponent} from './candidates/candidates.component';
import {web3Provider} from './providers/web3.provider';
import {BlockChainService} from './services/block-chain.service';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
      AppComponent,
      CandidatesComponent
  ],
  imports: [
      BrowserModule,
      ReactiveFormsModule
  ],
    providers: [
        {
            provide: 'web3',
            useFactory: web3Provider
        },
        {
            provide : 'contractAddress',
            useValue : '0x6a43401451b4faf17f1e24683dcd45eacfe27dfb'
        },
        BlockChainService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
