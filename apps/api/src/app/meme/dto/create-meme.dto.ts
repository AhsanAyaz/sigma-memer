import { MemeToGenerate } from '@sigma-memer/api-interfaces';

export class CreateMemeDto implements MemeToGenerate {
  top?: string;
  bottom?: string;
  meme: string;
}
