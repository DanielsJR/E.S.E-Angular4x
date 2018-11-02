import { MatPaginatorIntl } from "@angular/material/paginator";

export class MatPaginatorIntlSpa extends MatPaginatorIntl {
    itemsPerPageLabel = 'Items por pagina:';
    nextPageLabel = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
  
    /** A label for the range of items within the current page and the length of the whole list. */
    getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
      } length = Math.max(length, 0); const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    }
  }