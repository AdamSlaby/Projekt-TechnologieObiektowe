import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './styles/vertex-styles';
import {Column} from './model/column';
import {Table} from './model/table';
import {Settings} from './settings/settings';
import {ContextMenu} from './menu/context-menu';

declare var mxGraph: any;
declare var mxEditor: any;
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
  graph;
  model;
  settings: Settings;

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

    this.graph.getStylesheet().putDefaultVertexStyle(Styles.getEntityStyle());
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

}
