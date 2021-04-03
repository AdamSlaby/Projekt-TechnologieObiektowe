import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './Styles/vertex-styles';
import {Column} from './Model/column';
import {Table} from './Model/table';

declare var mxGraph: any;
declare var mxEditor: any;
declare var mxGraphModel: any;
declare var mxCell: any;
declare var mxGeometry: any;
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
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.model = this.graph.model;

    this.graph.setConnectable(true);
    this.graph.setCellsDisconnectable(false);
    this.graph.swimlaneNesting = false;
    this.graph.setAllowDanglingEdges(false);
    this.graph.getStylesheet().putDefaultVertexStyle(Styles.getEntityStyle());
    this.graph.getStylesheet().putCellStyle('table', Styles.getTableStyle());
    Styles.setEdgeStyle(this.graph);
    this.editor.layoutSwimlanes = true;

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

    this.graph.model.valueForCellChanged = (cell, value) => {
      if (value.name != null) {
        return mxGraphModel.prototype.valueForCellChanged.apply(this.graph.model, arguments);
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
        menu.addItem('Usuń', 'assets/delete.png', () => this.deleteTable(cell));
      }
    };

    this.graph.getLabel = (cell) => {
      if (this.graph.isHtmlLabel(cell)) {
        let label = '';

        if (cell.value.primaryKey) {
          label += '<img alt="klucz główny" src="assets/key.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.unique) {
          label += '<img alt="unique" src="assets/unique.png" width="16" height="16" align="top">&nbsp;';
        }

        return label + mxUtils.htmlEntities(cell.value.name, false) + ': ' +
          mxUtils.htmlEntities(cell.value.type, false);
      }

      return mxGraph.prototype.getLabel.apply(this, arguments);
    };
  }

  addTableToGraph() {
    const parent = this.graph.getDefaultParent();
    const table = new Table('Entity');
    const entity = this.model.cloneCell(table.getTableCell());
    this.graph.getModel().beginUpdate();
    try {
      this.graph.addCell(entity, parent);
      entity.geometry.alternateBounds = new mxRectangle(0, 0, entity.geometry.width, entity.geometry.height);
    } finally {
      this.graph.getModel().endUpdate();
    }
    this.graph.setSelectionCell(entity);
  }

  addNewColumn(name: string) {

  }

  deleteTable(vertexID) {
      const array =  [vertexID];
      this.graph.removeCells(array);
  }
}
