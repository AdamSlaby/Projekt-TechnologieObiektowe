import {Column} from './column';
import {SqlGeneratorStrategy} from './sql-generator-strategy';

declare var mxUtils: any;
declare var mxCell: any;
declare var mxGeometry: any;

export class Table implements SqlGeneratorStrategy {
  name: string;
  columns: Array<Column>;
  parent: Table;
  isAbstract: boolean;

  constructor(name: string) {
    this.name = name;
    this.columns = new Array<Column>();
    this.parent = null;
    this.isAbstract = false;
  }

  addColumn(column: Column) {
    this.columns.push(column);
  }

  deleteColumn(column: Column) {
    this.columns = this.columns.filter(col => col !== column);
  }

  setAbstract() {
    this.isAbstract = true;
    this.columns = this.columns.filter(col => col.primaryKey !== true);
  }

  getTableCell() {
    const table = new mxCell(this, new mxGeometry(0, 0, 200, 30), 'table');
    table.setVertex(true);

    const columnObject = new Column('ColumnId');
    const column = columnObject.getDefaultColumnCell().clone();
    column.value.primaryKey = true;
    table.insert(column);
    this.addColumn(column.value);
    return table;
  }

  generateSql(): string {
    let sql = '';
    this.columns.forEach(column => sql += column.generateSql());
    if (this.parent) {
      sql += this.parent.generateSql();
    }
    return sql;
  }

  clone() {
    return mxUtils.clone(this);
  }
}
