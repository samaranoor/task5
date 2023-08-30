import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { catchError } from 'rxjs/operators';
import { faSun, faCloud, faCloudRain, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit{
    lat: any;
    lon: any;
    weather: any;
    errorMessage: string = '';
    temperatureUnit: string = 'F'; // Default to Fahrenheit
    weatherIcons: { [key: string]: any } = [];
    favoriteCities: string[] = [];

  
  
  constructor(private weatherServices: WeatherService) {
    this.weatherIcons = {
      'Clear': faSun,
      'Clouds': faCloud,
      'Rain': faCloudRain,
  };

  const storedFavorites = localStorage.getItem('favoriteCities');
  if (storedFavorites) {
      this.favoriteCities = JSON.parse(storedFavorites);
  }
}

  ngOnInit(): void {
    //this.weatherServices.getWeatherDateByCoords(35, 139).subscribe(console.log)
    this.getLocation();

  }

  getLocation() {
      if("geolocation" in navigator) {
        navigator.geolocation.watchPosition((success)=>{
          this.lat = success.coords.latitude;
          this.lon = success.coords.longitude;

          this.weatherServices.getWeatherDateByCoords(this.lat, this.lon).subscribe(data=>{
            this.weather = data;
          });
        })
      }
  }

  getCity(city: any) {
    this.weatherServices.getWeatherDataByCityName(city)
        .pipe(
            catchError(error => {
                console.error('An error occurred:', error);
                return this.errorMessage = 'Please try again (incorrect city name)';
            })
        )
        .subscribe((data: any) => { // Specify the type of 'data'
          this.weather = data;
      });
}


toggleTemperatureUnit() {
  this.temperatureUnit = this.temperatureUnit === 'F' ? 'C' : 'F';
}

convertTemperature(temperature: number): number {
  if (this.temperatureUnit === 'C') {
      return (temperature - 32) * (5 / 9);
  } else {
      return temperature;
  }
}

getWeatherIcon() {
  const condition = this.weather.weather[0].main;
  return this.weatherIcons[condition] || faQuestionCircle; // Default icon for unknown conditions
}

addToFavorites(city: string) {
  if (!this.favoriteCities.includes(city)) {
      this.favoriteCities.push(city);

       // Save to storage
       localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
  }
}

}
