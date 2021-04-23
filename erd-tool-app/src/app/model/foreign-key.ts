export class ForeignKey {
  referenceTable: string;
  referenceColumn: string;


  constructor(referenceTable: string, referenceColumn: string) {
    this.referenceTable = referenceTable;
    this.referenceColumn = referenceColumn;
  }
}
