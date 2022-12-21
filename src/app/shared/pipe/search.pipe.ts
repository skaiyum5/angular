import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchField: string, searchValue: string): any[] {
    if (!items || !items.length) return items;
    if (!searchValue || !searchValue.length) return items;

    if (searchField == 'accounT_NUMBER') {      
      return items.filter(item => {
        return (item.brancH_ID.toString() + item.accounT_NUMBER.toString()).toLowerCase().replace('-','').indexOf(searchValue.toLowerCase().replace('-','')) > -1
      });
    }
    else if (searchField == 'benf_acc_no') {      
      return items.filter(item => {
        return (item.branchID.toString() + item.benf_acc_no.toString()).toLowerCase().replace('-','').indexOf(searchValue.toLowerCase().replace('-','')) > -1
      });
    }    
    else {
      return items.filter(item => {
        return item[searchField].toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      });
    }
  }
}
