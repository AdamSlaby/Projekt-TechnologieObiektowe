import {Utility} from '../logic/utility';

export class Relation {
  firstTable: any;
  secondTable: any;
  firstPrimaryKey: any;
  secondPrimaryKey: any;

  constructor(firstTable: any, secondTable: any, firstPrimaryKey: any, secondPrimaryKey: any) {
    this.firstTable = firstTable;
    this.secondTable = secondTable;
    this.firstPrimaryKey = firstPrimaryKey;
    this.secondPrimaryKey = secondPrimaryKey;
  }

  generateSql(): string {
    let sql = '';
    sql += this.generateAdditionalTable();
    sql += Utility.getSqlRelation(this.getAdditionalTableName(), this.getAdditionalTableColumn(1),
      this.firstTable.value.name, this.firstPrimaryKey.value.name, (Date.now() - 10).toString());
    sql += Utility.getSqlRelation(this.getAdditionalTableName(), this.getAdditionalTableColumn(2),
      this.secondTable.value.name, this.secondPrimaryKey.value.name, Date.now().toString());
    return sql;
  }

  private generateAdditionalTable(): string {
    return '\nCREATE TABLE IF NOT EXISTS ' + this.getAdditionalTableName() + '(\n\t' +
      this.getAdditionalTableColumn(1) + ' ' + this.firstPrimaryKey.value.type + ' NOT NULL,\n\t' +
      this.getAdditionalTableColumn(2) + ' ' + this.secondPrimaryKey.value.type + ' NOT NULL,\n\t' +
      'PRIMARY KEY(' + this.getPrimaryKey() + ')\n);\n';
  }

  private getAdditionalTableName(): string {
    return this.firstTable.value.name + '_' + this.secondTable.value.name;
  }

  private getPrimaryKey(): string {
    return this.firstTable.value.name + '_' + this.firstPrimaryKey.value.name + ', ' +
      this.secondTable.value.name + '_' + this.secondPrimaryKey.value.name;
  }

  private getAdditionalTableColumn(columnNumber: number): string {
    if (columnNumber === 1) {
      return this.firstTable.value.name + '_' + this.firstPrimaryKey.value.name;
    } else {
      return  this.secondTable.value.name + '_' + this.secondPrimaryKey.value.name;
    }
  }
}
