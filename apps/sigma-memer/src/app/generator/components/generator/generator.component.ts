import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../../services/generator.service';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  throwError,
} from 'rxjs';
import { THROTTLE_CONFIG } from '@sigma-memer/api-interfaces';

@Component({
  selector: 'sigma-memer-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit {
  memes: string[] = [];
  selectedMeme: string | null = null;
  isGenerating = false;
  faTimes = faTimes;
  faSpinner = faSpinner;
  generatorForm: FormGroup;
  downloadUrl = '';
  throttleConfig = THROTTLE_CONFIG;
  generationError = '';
  constructor(
    private genService: GeneratorService,
    private formBuilder: FormBuilder
  ) {
    this.generatorForm = this.formBuilder.group({
      topText: '',
      bottomText: '',
      memeSearch: '',
    });
  }

  ngOnInit(): void {
    this.generatorForm
      .get('memeSearch')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText) => this.genService.getMemes(searchText))
      )
      .subscribe((memesArr) => {
        this.memes = memesArr;
        this.setSelectedMeme(null);
      });

    this.generatorForm.get('memeSearch')?.setValue('');
  }

  setSelectedMeme = (meme: string | null): void => {
    this.selectedMeme = meme;
  };

  clearDownloadUrl() {
    this.downloadUrl = '';
  }

  closeDownloadToast(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.clearDownloadUrl();
  }

  generateMeme() {
    this.generationError = '';
    this.clearDownloadUrl();
    if (!this.selectedMeme) {
      return;
    }
    const { topText, bottomText } = this.generatorForm.value;
    console.log({ topText, bottomText, meme: this.selectedMeme });
    this.isGenerating = true;

    this.genService
      .createMeme({
        top: topText,
        bottom: bottomText,
        meme: this.selectedMeme,
      })
      .pipe(
        catchError((err) => {
          this.isGenerating = false;
          switch (err.status) {
            case 429:
              this.generationError = `Too many requests. You can only generate ${this.throttleConfig.limit} memes in a span of ${this.throttleConfig.minutes} minutes`;
              break;

            default:
              this.generationError =
                'Something went wrong. Please try again later';
              break;
          }
          return throwError(() => new Error(err));
        })
      )
      .subscribe((res) => {
        this.isGenerating = false;
        this.downloadUrl = res.url;
      });
  }
}
