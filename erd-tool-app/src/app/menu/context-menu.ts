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
          case CellType.RELATION: {
            this.defineRelationMenu(menu, cell);
            break;
          }
        }
      }
    };
  }

  private defineTableMenu(menu, cell) {
    menu.addItem('Usuń tabelę', 'assets/delete.png', () => this.deleteCell(cell));
    menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
  }

  private defineColumnMenu(menu, cell) {
    menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
    menu.addItem('Usuń kolumnę', 'assets/delete.png', () => this.deleteCell(cell));
    if (!cell.value.foreignKey) {
      menu.addItem('Primary key', this.setPropertyIcon(cell.value.primaryKey), () => this.changeColumnType(cell, Type.PRIMARY_KEY));

      if (!cell.value.primaryKey) {
        menu.addItem('Unique', this.setPropertyIcon(cell.value.unique), () => this.changeColumnType(cell, Type.UNIQUE));
        menu.addItem('Not null', this.setPropertyIcon(cell.value.notNull), () => this.changeColumnType(cell, Type.NOT_NULL));
      }
    }
  }

  private defineRelationMenu(menu, cell) {
    menu.addItem('Usuń relację', 'assets/delete.png', () => this.deleteCell(cell));
  }

  private deleteCell(vertexID) {
    const array = [vertexID];
    this.graph.removeCells(array);
  }

  private changeColumnType(cell, type: Type) {
    const value = cell.value.clone();
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
    columnObject.type = 'TEXT';
    const column = columnObject.getDefaultColumnCell();
    this.graph.getModel().beginUpdate();
    try {
      this.graph.addCell(column, parent);
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

  getCellType(cell) {
    if (!this.graph.isSwimlane(cell) && !this.graph.getModel().isEdge(cell)) {
      return CellType.COLUMN;
    }
    if (this.graph.getModel().isEdge(cell)) {
      return CellType.RELATION;
    }
    return CellType.TABLE;
  }
}
