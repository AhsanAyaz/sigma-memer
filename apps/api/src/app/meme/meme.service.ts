import { Injectable } from '@nestjs/common';
import { CreateMemeDto } from './dto/create-meme.dto';
import { readFileSync, writeFileSync } from 'fs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { resolve } from 'path';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const memesFilePath = resolve(__dirname, 'assets/memes.json');

@Injectable()
export class MemeService {
  memes: string[] = [];
  constructor(private http: HttpService) {
    try {
      this.memes = JSON.parse(readFileSync(memesFilePath, 'utf-8'));
    } catch (err) {
      console.log('No memes file found, creating one');
      this.generateMemesFile();
    }
  }
  create(dto: CreateMemeDto) {
    return this.http
      .request({
        url: 'https://ronreiter-meme-generator.p.rapidapi.com/meme',
        method: 'GET',
        params: {
          top: dto.top,
          bottom: dto.bottom,
          meme: dto.meme,
        },
        headers: {
          'X-RapidAPI-Host': process.env.RapidAPI_Host,
          'X-RapidAPI-Key': process.env.RapidAPI_Key,
        },
        responseType: 'arraybuffer',
      })
      .pipe(
        map((resp: AxiosResponse) => {
          console.log('generated the memez');
          return {
            url: `data:image/png;base64,${Buffer.from(resp.data).toString(
              'base64'
            )}`,
          };
        }),
        catchError((err) => {
          console.log(
            '🚀 ~ file: meme.service.ts ~ line 38 ~ MemeService ~ catchError ~ err',
            err
          );
          return of(err);
        })
      );
  }

  findAll(q: string) {
    return this.search(q, this.memes);
  }

  search(query: string, memesList: string[]) {
    const regex = new RegExp(query, 'i');
    return memesList
      .filter((meme) => {
        if (query === '' && meme.toLowerCase().includes('finger')) {
          return false;
        }
        return regex.test(meme);
      })
      .slice(0, 10);
  }

  generateMemesFile() {
    this.http
      .request({
        url: 'https://ronreiter-meme-generator.p.rapidapi.com/images',
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': process.env.RapidAPI_Host,
          'X-RapidAPI-Key': process.env.RapidAPI_Key,
        },
      })
      .subscribe((resp: AxiosResponse) => {
        this.memes = resp.data;
        writeFileSync(memesFilePath, JSON.stringify(this.memes));
        console.log('File written for memes');
      });
  }
}
