declare var mxGraph: any;
declare var mxUtils: any;

export class Settings {
  graph;
  editor;

  constructor(editor) {
    this.editor = editor;
    this.graph = editor.graph;
  }

  setGeneralSettings() {
    this.graph.setConnectable(true);
    this.graph.setCellsDisconnectable(false);
    this.graph.setCellsCloneable(false);
    this.graph.swimlaneNesting = false;
    this.editor.layoutSwimlanes = true;
  }

  setCellProperties() {
    this.graph.isCellResizable = (cell) => {
      return this.graph.isSwimlane(cell);
    };

    this.graph.isCellMovable = (cell) => {
      return this.graph.isSwimlane(cell);
    };
  }

  setLogicForCellValueChanged() {
    this.graph.getModel().valueForCellChanged = (cell, value) => {
      if (value.name != null) {
        cell.value = value;
        return value.clone();
      } else {
        const oldName = cell.value.name;
        cell.value.name = value;
        return oldName;
      }
    };
  }

  setValueForCell() {
    this.graph.convertValueToString = (cell) => {
      if (cell.value != null && cell.value.name != null) {
        return cell.value.name;
      }
      return mxGraph.prototype.convertValueToString.apply(this, arguments);
    };
  }

  setVisibleLabels() {
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
      if (this.graph.isSwimlane(cell)) {
        return mxUtils.htmlEntities(cell.value.name, false);
      }
      return mxGraph.prototype.getLabel.apply(this, arguments);
    };
  }

  setCellHtmlLabel() {
    this.graph.isHtmlLabel = (cell) => {
      return !this.graph.isSwimlane(cell) && !this.graph.getModel().isEdge(cell);
    };
  }
}
