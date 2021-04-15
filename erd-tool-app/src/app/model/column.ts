
declare var mxCell: any;
declare var mxGeometry: any;
declare var mxUtils: any;

export class Column {
  name: string;
  type: string;
  primaryKey: boolean;
  notNull: boolean;
  unique: boolean;

  constructor(name: string) {
    this.name = name;
    this.type = 'INT';
    this.primaryKey = false;
    this.notNull = false;
    this.unique = false;
  }

  isPrimaryKey(): boolean {
    return this.primaryKey;
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