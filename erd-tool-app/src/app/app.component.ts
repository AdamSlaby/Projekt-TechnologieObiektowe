import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './Styles/vertex-styles';

declare var mxGraph: any;
declare var mxEvent: any;
declare var mxEditor: any;
declare var mxPopupMenuHandler: any;

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
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.graph.setConnectable(true);
    this.graph.popupMenuHandler = new mxPopupMenuHandler(this.graph, (menu, cell, evt) => {
      if (cell != null) {
        menu.addItem('Delete', '', () => this.deleteTable(cell));
      }
    });

    this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
      const vertexID = evt.getProperty('cell');
      if (vertexID) {
        this.graph.popupMenuHandler.popup(screenX, screenY, vertexID, this);
      }
    });
  }

  addTableToGraph() {
    const parent = this.graph.getDefaultParent();
    this.graph.getModel().beginUpdate();
    try {
      this.graph.getStylesheet().putCellStyle('entityStyle', Styles.getEntityStyle());
      const entity = this.graph.insertVertex(parent, null, 'Entity', 0, 0, 180, 30, 'entityStyle');
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  deleteTable(vertexID) {
      const array =  [vertexID];
      this.graph.removeCells(array);
  }
}
