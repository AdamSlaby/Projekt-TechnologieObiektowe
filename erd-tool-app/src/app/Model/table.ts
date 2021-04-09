import {Column} from './column';

declare var mxUtils: any;
declare var mxCell: any;
declare var mxGeometry: any;

export class Table {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getTableCell() {
    const table = new mxCell(this, new mxGeometry(0, 0, 200, 30), 'table');
    table.setVertex(true);

    const columnObject = new Column('ColumnId');
    const column = columnObject.getDefaultColumnCell().clone();
    column.value.primaryKey = true;
    table.insert(column);
    return table;
  }

  clone() {
    return mxUtils.clone(this);
  }
}
