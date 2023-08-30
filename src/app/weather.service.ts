import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
    url = "https://api.openweathermap.org/data/2.5/weather";
    apiKey = "18e1497aa69908e2a14afcfeabf75042";

    private weatherCache: { [city: string]: any } = {};
  constructor(private http:HttpClient) { }

  getWeatherDateByCoords(lat: any, lon: any){
    let params = new HttpParams()
    .set('lat', lat)
    .set('lon', lon)
    .set('units', 'imperial')
    .set('appid', this.apiKey)

    return this.http.get(this.url, { params });

  }

  getWeatherDataByCityName(city: string){
    if (this.weatherCache[city]) {
      return of(this.weatherCache[city]); // Return cached data if available
  } else {
    let params = new HttpParams()
    .set('q', city)
    .set('units', 'imperial')
    .set('appid', this.apiKey)

    return this.http.get(this.url, { params }).pipe(
      tap((data: any) => {
          this.weatherCache[city] = data; // Cache the fetched data
      })
  );
}
}
}
