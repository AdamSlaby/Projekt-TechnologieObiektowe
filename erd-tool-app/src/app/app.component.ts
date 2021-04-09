import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './Styles/vertex-styles';
import {Column} from './Model/column';
import {Table} from './Model/table';
import {Type} from './Logic/type.enum';

declare var mxGraph: any;
declare var mxEditor: any;
declare var mxStackLayout: any;
declare var mxUtils: any;
declare var mxRectangle: any;
declare var mxSwimlane: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  faTable = faTable;
  faProjectDiagram = faProjectDiagram;
  graph;
  editor = new mxEditor();
  model;
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    this.editor.setGraphContainer(this.graphContainer.nativeElement);
    this.graph =  this.editor.graph;
    this.model = this.graph.getModel();

    this.graph.setConnectable(true);
    // this.graph.setAllowDanglingEdges(false);
    this.graph.setCellsDisconnectable(false);
    this.graph.setCellsCloneable(false);
    this.graph.swimlaneNesting = false;

    this.graph.getStylesheet().putDefaultVertexStyle(Styles.getEntityStyle());
    this.graph.getStylesheet().putCellStyle('table', Styles.getTableStyle());
    Styles.setEdgeStyle(this.graph);
    this.editor.layoutSwimlanes = true;

    mxSwimlane.prototype.imageSize = 20;
    mxSwimlane.prototype.imageDx = 16;
    mxSwimlane.prototype.imageDy = 4;

    mxSwimlane.prototype.getImageBounds = (x, y, w, h) => {
      return new mxRectangle(x + mxSwimlane.prototype.imageDx, y + mxSwimlane.prototype.imageDy,
        mxSwimlane.prototype.imageSize, mxSwimlane.prototype.imageSize);
    };

    this.graph.isCellResizable = (cell) => {
      return this.graph.isSwimlane(cell);
    };

    this.graph.isCellMovable = (cell) => {
      return this.graph.isSwimlane(cell);
    };

    this.editor.createSwimlaneLayout = () => {
      const layout = new mxStackLayout(this.graph, false);
      layout.fill = true;
      layout.resizeParent = true;

      layout.isVertexMovable = (cell) => {
        return true;
      };
      return layout;
    };

    this.model.valueForCellChanged = (cell, value) => {
      if (value.name != null) {
        cell.value = value;
        return value.clone();
      } else {
        const oldName = cell.value.name;
        cell.value.name = value;
        return oldName;
      }
    };

    this.graph.isHtmlLabel = (cell) => {
      return !this.graph.isSwimlane(cell) && !this.model.isEdge(cell);
    };

    this.graph.convertValueToString = (cell) => {
      if (cell.value != null && cell.value.name != null) {
        return cell.value.name;
      }
      return mxGraph.prototype.convertValueToString.apply(this, arguments);
    };

    window.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    }, false);

    this.graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
      if (cell != null) {
        if (!this.graph.isSwimlane(cell)) {
          menu.addItem('Usuń kolumnę', 'assets/delete.png', () => this.deleteCell(cell));
          if (cell.value.primaryKey) {
            menu.addItem('Primary key', 'assets/correct.png', () => this.changeColumnType(cell, Type.PRIMARY_KEY));
          } else {
            menu.addItem('Primary key', 'assets/wrong.png', () => this.changeColumnType(cell, Type.PRIMARY_KEY));
          }

          if (cell.value.unique) {
            menu.addItem('Unique', 'assets/correct.png', () => this.changeColumnType(cell, Type.UNIQUE));
          } else {
            menu.addItem('Unique', 'assets/wrong.png', () => this.changeColumnType(cell, Type.UNIQUE));
          }

          if (cell.value.notNull) {
            menu.addItem('Not null', 'assets/correct.png', () => this.changeColumnType(cell, Type.NOT_NULL));
          } else {
            menu.addItem('Not null', 'assets/wrong.png', () => this.changeColumnType(cell, Type.NOT_NULL));
          }

        } else {
          menu.addItem('Usuń tabelę', 'assets/delete.png', () => this.deleteCell(cell));
        }
        menu.addItem('Dodaj kolumnę', 'assets/add.png', () => this.addNewColumn(cell));
      }
    };

    this.graph.getLabel = (cell) => {
      if (this.graph.isHtmlLabel(cell)) {
        let label = '';

        if (cell.value.primaryKey) {
          label += '<img alt="primary key" src="assets/key.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.unique) {
          label += '<img alt="unique" src="assets/unique.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.notNull) {
          label += '<img alt="not null" src="assets/notNull.png" width="16" height="16" align="top">&nbsp;';
        }

        return label + mxUtils.htmlEntities(cell.value.name, false) + ': type ' +
          mxUtils.htmlEntities(cell.value.type, false);
      }

      return mxGraph.prototype.getLabel.apply(this, arguments);
    };
  }

  addTableToGraph() {
    this.graph.stopEditing(false);
    const parent = this.graph.getDefaultParent();
    const table = new Table('Entity');
    const entity = this.model.cloneCell(table.getTableCell());
    this.model.beginUpdate();
    try {
      this.graph.addCell(entity, parent);
      entity.geometry.alternateBounds = new mxRectangle(0, 0, entity.geometry.width, entity.geometry.height);
    } finally {
      this.model.endUpdate();
    }
  }

  addNewColumn(cell) {
    const parent = this.getCellSwimlane(cell);
    const columnObject = new Column('ColumnName');
    columnObject.type = 'TEXT';
    const column = columnObject.getDefaultColumnCell();
    this.model.beginUpdate();
    try {
      this.graph.addCell(column, parent);
    } finally {
      this.model.endUpdate();
    }
  }

  getCellSwimlane(cell) {
    if (this.graph.isSwimlane(cell)) {
      return cell;
    } else {
      return cell.getParent();
    }
  }

  deleteCell(vertexID) {
      const array = [vertexID];
      this.graph.removeCells(array);
  }

  changeColumnType(cell, type: Type) {
    const value = cell.value.clone();
    switch (type) {
      case Type.NOT_NULL: value.notNull = !value.notNull; break;
      case Type.PRIMARY_KEY: value.primaryKey = !value.primaryKey; break;
      case Type.UNIQUE: value.unique = !value.unique;
    }
    this.model.setValue(cell, value);
  }
}
