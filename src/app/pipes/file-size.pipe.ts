import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, args?: any): any {
    let counter = 0
    while (value >= 1024) {
      value /= 1024
      counter++
    }
    let unit =
      counter == 0
        ? 'bytes'
        : counter == 1
        ? 'KB'
        : counter == 2
        ? 'MB'
        : counter == 3
        ? 'GB'
        : 'N/a'

    return value.toFixed(2) + ' ' + unit
  }
}
