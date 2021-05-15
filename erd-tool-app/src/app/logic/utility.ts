declare var mxEvent: any;

export abstract class Utility {

  static getTableCell(graph, cell) {
    if (graph.isSwimlane(cell)) {
      return cell;
    } else {
      return cell.getParent();
    }
  }

  static isManyToManyRelation(style): boolean {
    if (style.startArrow.includes('oneToMany') && style.endArrow.includes('oneToMany')) {
      return true;
    }
    return false;
  }

  static isInheritanceRelation(style): boolean {
    if (style.startArrow.includes('none') && style.endArrow.includes('block')) {
      return true;
    }
    return false;
  }

  static isColumnClicked(cell, graph, event): boolean {
    if ((cell != null && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell)
      && mxEvent.isLeftMouseButton(event) && !cell.value.foreignKey)) {
      return true;
    }
    return false;
  }

  static getReferenceKeys(cell, graph) {
    const referenceColumns = [];
    const table = cell.value.foreignKey.referenceTable;
    const childCount = graph.getModel().getChildCount(table);
    for (let i = 0; i < childCount; i++) {
      const column = graph.getModel().getChildAt(table, i);
      if (column.value.primaryKey || column.value.unique) {
        referenceColumns.push(column);
      }
    }
    return referenceColumns;
  }

  static getTablePrimaryKey(graph, table) {
    const childCount = graph.getModel().getChildCount(table);

    for (let i = 0; i < childCount; i++) {
      const child = graph.getModel().getChildAt(table, i);

      if (child.value.primaryKey) {
        return child;
      }
    }
    return null;
  }

  static getSqlRelation(firstTableName: string, firstColumnName: string,
                        secondTableName: string, secondColumnName: string, constraint: string): string {
    return 'ALTER TABLE ' + firstTableName + ' ADD CONSTRAINT ' + constraint + '_ID' + ' FOREIGN KEY' + ' (' +
      firstColumnName + ')' + ' REFERENCES ' + secondTableName + '(' + secondColumnName + ');\n\n';
  }
}
