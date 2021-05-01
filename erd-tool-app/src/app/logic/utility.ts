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

  static getTablePrimaryKey(graph, table) {
    const childCount = graph.getModel().getChildCount(table);

    for (let i = 0; i < childCount; i++) {
      const child = graph.getModel().getChildAt(table, i);

      if (child.value.primaryKey) {
        return child;
      }
    }
  }

  static getSqlRelation(firstTableName: string, firstColumnName: string,
                        secondTableName: string, secondColumnName: string, constraint: string): string {
    return 'ALTER TABLE ' + firstTableName + ' ADD CONSTRAINT ' + constraint + '_ID' + ' FOREIGN KEY' + ' (' +
      firstColumnName + ')' + ' REFERENCES ' + secondTableName + '(' + secondColumnName + ');\n\n';
  }
}
