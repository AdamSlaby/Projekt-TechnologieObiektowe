import {Utility} from '../logic/utility';

export class ForeignKey {
  referenceTable: any;
  referenceColumn: any;
  sourceTable: any;
  column: any;
  constraint: string;

  constructor(referenceTable: any, referenceColumn: any, sourceTable: any, column: any) {
    this.referenceTable = referenceTable;
    this.referenceColumn = referenceColumn;
    this.sourceTable = sourceTable;
    this.column = column;
    this.constraint = Date.now().toString();
  }

  generateRelationInSql(): string {
    return Utility.getSqlRelation(this.sourceTable.value.name, this.column.value.name,
      this.referenceTable.value.name, this.referenceColumn.value.name, this.constraint);
  }
}
