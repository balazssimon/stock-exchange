import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { INews } from '../../../common/data';

@Injectable()
export class NewsService {
    private url = 'api/news';  // URL to web api

    constructor(private http: Http) { }

    getNews(): Promise<INews[]> {
        return this.http.get(this.url)
                .toPromise()
                .then(response => response.json().data as INews[])
                .catch(this.handleError);
    }

    getNewsById(id: number): Promise<INews> {
        return this.http.get(`${this.url}/${id}`)
                .toPromise()
                .then(response => response.json().data as INews)
                .catch(this.handleError);
    }

    private headers = new Headers({'Content-Type': 'application/json'});

    update(news: INews): Promise<INews> {
        const url = `${this.url}/${news.id}`;
        return this.http
            .put(url, JSON.stringify(news), {headers: this.headers})
            .toPromise()
            .then(() => news)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    create(news: INews): Promise<INews> {
        return this.http
            .post(this.url, JSON.stringify(news), {headers: this.headers})
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.url}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }
}
