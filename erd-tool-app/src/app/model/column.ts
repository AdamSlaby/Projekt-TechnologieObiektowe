import {ForeignKey} from './foreign-key';
import {SqlGeneratorStrategy} from './sql-generator-strategy';

declare var mxCell: any;
declare var mxGeometry: any;
declare var mxUtils: any;

export class Column implements SqlGeneratorStrategy {
  name: string;
  type: string;
  primaryKey: boolean;
  foreignKey: ForeignKey;
  notNull: boolean;
  unique: boolean;

  constructor(name: string) {
    this.name = name;
    this.type = 'INT';
    this.primaryKey = false;
    this.foreignKey = null;
    this.notNull = false;
    this.unique = false;
  }

  isPrimaryKey(): boolean {
    return this.primaryKey;
  }

  isForeignKey(): boolean {
      return !this.foreignKey;
  }

  getDefaultColumnCell() {
    const column = new mxCell(this, new mxGeometry(0, 0, 0, 30));
    column.setVertex(true);
    column.setConnectable(false);
    return column;
  }

  generateSql(): string {
    let sql = '';
    sql += '\n\t' + this.name + ' ' + this.type;

    if (this.primaryKey) {
      sql += ' PRIMARY KEY';
    }

    if (this.unique) {
      sql += ' UNIQUE';
    }

    if (this.notNull) {
      sql += ' NOT NULL';
    }
    sql += ',';
    return sql;
  }

  clone() {
    return mxUtils.clone(this);
  }
}
