import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './vertex-styles';

declare var mxGraph: any;
declare var mxConstants: any;
declare var mxStyleChange: any;
declare var mxHierarchicalLayout: any;
declare var mxEvent: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  faTable = faTable;
  faProjectDiagram = faProjectDiagram;
  graph;
  style = new Object();
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    this.graph = new mxGraph(this.graphContainer.nativeElement);

    this.style[mxConstants.STYLE_SHAPE] = 'box';
    this.style[mxConstants.STYLE_STROKECOLOR] = '#000000';
    this.style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    this.style[mxConstants.DEFAULT_STARTSIZE] = 10;
    this.style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    this.graph.getStylesheet().putCellStyle('boxstyle', this.style);

    window.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
      const vertexID = evt.getProperty('cell');
      if (vertexID ) {

      }
    });
  }

  addTableToGraph() {
    try {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      const entity = this.graph.insertVertex(parent, null, 'Entity', 0, 0, 200, 80, 'boxstyle');
      entity.getStyle();
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
}
