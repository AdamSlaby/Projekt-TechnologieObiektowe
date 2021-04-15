import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './styles/vertex-styles';
import {Table} from './model/table';
import {Settings} from './settings/settings';
import {ContextMenu} from './menu/context-menu';
import {Utility} from './logic/utility';
import {ColumnType} from './model/column-type';

declare var mxGraph: any;
declare var mxEditor: any;
declare var mxEvent: any;
declare var mxStackLayout: any;
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
  editor = new mxEditor();
  columnTypes = ColumnType.getAllColumnTypes();
  column;
  chosenCell;
  chosenTableName: string;
  graph;
  model;
  settings: Settings;
  isColumnClicked = false;

  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    this.editor.setGraphContainer(this.graphContainer.nativeElement);
    this.graph =  this.editor.graph;
    this.model = this.graph.getModel();

    this.settings = new Settings(this.editor);
    this.settings.setGeneralSettings();
    this.settings.setCellHtmlLabel();
    this.settings.setCellProperties();
    this.settings.setLogicForCellValueChanged();
    this.settings.setValueForCell();
    this.settings.setVisibleLabels();

    this.graph.getStylesheet().putDefaultVertexStyle(Styles.getColumnStyle());
    this.graph.getStylesheet().putCellStyle('table', Styles.getTableStyle());
    Styles.setEdgeStyle(this.graph);

    this.editor.createSwimlaneLayout = () => {
      const layout = new mxStackLayout(this.graph, false);
      layout.fill = true;
      layout.resizeParent = true;

      layout.isVertexMovable = (cell) => {
        return true;
      };
      return layout;
    };

    const menu = new ContextMenu(this.graph);
    menu.defineContextMenu();

    window.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    }, false);

    this.graph.addListener(mxEvent.CLICK, (sender, evt) => {

      const cell = evt.getProperty('cell');
      if (cell != null && !this.model.isEdge(cell) && !this.graph.isSwimlane(cell)) {
        const table = Utility.getTableCell(this.graph, cell);
        this.chosenTableName = table.value.name;
        this.chosenCell = cell;
        this.column = cell.value;
        this.isColumnClicked = true;
      } else {
        this.isColumnClicked = false;
      }
      evt.consume();
    });

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

  saveColumn() {
    if (this.column.primaryKey) {
      this.column.notNull = false;
      this.column.unique = false;
    }
    this.graph.getModel().setValue(this.chosenCell, this.column);
    this.isColumnClicked = false;
  }
}
