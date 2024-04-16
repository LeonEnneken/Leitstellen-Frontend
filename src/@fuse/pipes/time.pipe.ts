import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, type: 'SHORT' | 'LONG') {
    if (!(value) || value === 0) {
      return 'Keine Zeit..';
    }
    const time = value / 1000;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 3600 % 60);

    if(type === 'LONG') {
      let timeString = '';

      timeString += `${hours} Stunde${hours === 1 ? '' : 'n'}, `;
      timeString += `${minutes} Minute${minutes === 1 ? '' : 'n'}, `;
      timeString += `${seconds} Sekunde${seconds === 1 ? '' : 'n'}`;
  
      return timeString;
    }
    let timeString = '';

    timeString += `${hours} h, `;
    timeString += `${minutes} min, `;
    timeString += `${seconds} s`;

    return timeString;
  }
}