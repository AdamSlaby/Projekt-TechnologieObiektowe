import {ForeignKey} from './foreign-key';

declare var mxCell: any;
declare var mxGeometry: any;
declare var mxUtils: any;

export class Column {
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

  clone() {
    return mxUtils.clone(this);
  }
}
