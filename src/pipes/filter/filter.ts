import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {


  transform(value: any, term?: any, ...keys: any[]): any {
    if (term === undefined) return value;
    console.log(value);
    return value.filter((item) => {
      let found = false;
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (item.hasOwnProperty(key)) {
          if (item[key] !== null)
            found = item[key].toString().toLowerCase().includes(term.toLowerCase());
          if (found === true)
            return found;
        }
      }
      return found;
    });
  }
}
