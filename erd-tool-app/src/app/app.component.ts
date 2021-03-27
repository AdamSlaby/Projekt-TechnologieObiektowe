import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {mxgraph} from 'mxgraph';
import mxGraph = mxgraph.mxGraph;
import mxHierarchicalLayout = mxgraph.mxHierarchicalLayout;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'erd-tool-app';
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    const newGraph = new mxGraph(this.graphContainer.nativeElement);
    try {
      const parent = newGraph.getDefaultParent();
      newGraph.getModel().beginUpdate();
      const vertex1 = newGraph.insertVertex(parent, '1', 'Vertex 1', 0, 0, 200, 80);
      const vertex2 = newGraph.insertVertex(parent, '2', 'Vertex 2', 0, 0, 200, 80);
      newGraph.insertEdge(parent, '', '', vertex1, vertex2);
    } finally {
      newGraph.getModel().endUpdate();
      new mxHierarchicalLayout(newGraph).execute(newGraph.getDefaultParent());
    }
  }
}
