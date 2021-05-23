import {Type} from '../enums/type.enum';
import {mxgraph} from 'mxgraph';
import {Column} from '../model/column';
import {CellType} from '../enums/cell-type.enum';
import {Utility} from '../logic/utility';

export class ContextMenu {
  graph;

  constructor(graph: mxgraph.mxGraph) {
    this.graph = graph;
  }

  defineContextMenu() {
    this.graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
      if (cell != null) {
        switch (this.getCellType(cell)) {
          case CellType.TABLE: {
            this.defineTableMenu(menu, cell);
            break;
          }
          case CellType.COLUMN: {
            this.defineColumnMenu(menu, cell);
            break;
          }
          case CellType.FOREIGN_KEY: {
            this.defineForeignKeyMenu(menu, cell);
            break;
          }
          case CellType.RELATION: {
            this.defineRelationMenu(menu, cell);
          }
        }
      }
    };
  }

  private defineTableMenu(menu, cell) {
    menu.addItem('Usuń tabelę', 'assets/delete.png', () => this.deleteCell(cell));
    menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
    if (this.checkInheritanceRelation(cell)) {
      menu.addItem('Ustaw abstrakcję', this.setPropertyIcon(cell.value.isAbstract), () => this.setAbstract(cell));
    }
  }

  private defineColumnMenu(menu, cell) {
    menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
    menu.addItem('Usuń kolumnę', 'assets/delete.png', () => this.deleteCell(cell));
    menu.addItem('Primary key', this.setPropertyIcon(cell.value.primaryKey), () => this.changeColumnType(cell, Type.PRIMARY_KEY));
    if (!cell.value.primaryKey) {
      menu.addItem('Unique', this.setPropertyIcon(cell.value.unique), () => this.changeColumnType(cell, Type.UNIQUE));
      menu.addItem('Not null', this.setPropertyIcon(cell.value.notNull), () => this.changeColumnType(cell, Type.NOT_NULL));
    }
  }

  private defineForeignKeyMenu(menu, cell) {
    menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
    menu.addItem('Usuń kolumnę', 'assets/delete.png', () => this.deleteCell(cell));
    const referenceColumns = Utility.getReferenceKeys(cell, this.graph);
    if (referenceColumns.length > 1) {
      menu.addSeparator();
      const referenceColumnSubmenu = menu.addItem('Kolumna odniesienia', null, null);
      for (const column of referenceColumns) {
        menu.addItem(column.value.name, this.setReferenceColumnIcon(cell, column),
          () => this.changeReferenceColumn(cell, column), referenceColumnSubmenu);
      }
    }
  }

  private defineRelationMenu(menu, cell) {
    menu.addItem('Usuń relację', 'assets/delete.png', () => this.deleteCell(cell));
  }

  private deleteCell(cell) {
    const array = [cell];
    const cellType = this.getCellType(cell);
    if (cellType === CellType.COLUMN) {
      const tableCell = Utility.getTableCell(this.graph, cell);
      tableCell.value.deleteColumn(cell.value);
    }
    this.graph.removeCells(array);
  }

  private changeColumnType(cell, type: Type) {
    const value = cell.value;
    switch (type) {
      case Type.NOT_NULL:
        value.notNull = !value.notNull;
        break;
      case Type.PRIMARY_KEY: {
        value.primaryKey = !value.primaryKey;
        value.notNull = false;
        value.unique = false;
        break;
      }
      case Type.UNIQUE:
        value.unique = !value.unique;
    }
    this.graph.getModel().setValue(cell, value);
  }

  private addNewColumn(cell) {
    const parent = Utility.getTableCell(this.graph, cell);
    const columnObject = new Column('ColumnName');
    columnObject.type = 'VARCHAR(255)';
    parent.value.addColumn(columnObject);
    const column = columnObject.getDefaultColumnCell();
    this.graph.getModel().beginUpdate();
    try {
      this.graph.addCell(column, parent);
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  private changeReferenceColumn(cell, referenceColumn) {
    this.graph.getModel().beginUpdate();
    try {
      cell.value.foreignKey.referenceColumn = referenceColumn;
      cell.value.type = referenceColumn.value.type;
      cell.value.name = referenceColumn.value.name + '_FK';
      const connections = this.graph.getModel().getConnections(cell);
      this.graph.getModel().setTerminals(connections[0], cell, referenceColumn);
      this.graph.getModel().setValue(cell, cell.value);
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  private setPropertyIcon(property) {
    if (property) {
      return 'assets/correct.png';
    } else {
      return 'assets/wrong.png';
    }
  }

  private setReferenceColumnIcon(cell, column) {
    if (cell.value.foreignKey.referenceColumn === column) {
      return 'assets/correct.png';
    } else {
      return 'assets/wrong.png';
    }
  }

  getCellType(cell) {
    if (!this.graph.isSwimlane(cell) && !this.graph.getModel().isEdge(cell) && !cell.value.foreignKey) {
      return CellType.COLUMN;
    }
    if (!this.graph.isSwimlane(cell) && !this.graph.getModel().isEdge(cell) && cell.value.foreignKey) {
      return CellType.FOREIGN_KEY;
    }
    if (this.graph.getModel().isEdge(cell)) {
      return CellType.RELATION;
    }
    return CellType.TABLE;
  }

  private setAbstract(cell) {
    cell.value.setAbstract();
    const primaryKey = Utility.getTablePrimaryKey(this.graph, cell);
    this.graph.removeCells([primaryKey]);
  }

  private checkInheritanceRelation(cell): boolean {
    const connections = this.graph.getModel().getConnections(cell);
    let hasInheritance = false;
    connections.forEach(con => {
      if (con.value === 'Inheritance') {
        hasInheritance = true;
      }
    });
    return hasInheritance;
  }
}
