import {NameValidator} from '../validator/name-validator';
import {Column} from '../model/column';
import {ForeignKey} from '../model/foreign-key';
import {Utility} from '../logic/utility';
import {Relation} from '../model/relation';

declare var mxGraph: any;
declare var mxUtils: any;
declare var mxStackLayout: any;
declare var mxEvent: any;

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
    this.graph.allowDanglingEdges = false;
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

    this.graph.isCellEditable = (cell) => {
      return !this.graph.getModel().isEdge(cell);
    };
  }

  setLogicForCellValueChanged() {
    this.graph.getModel().valueForCellChanged = (cell, value) => {
      if (value.name != null) {
        if (NameValidator.validate(value.name)) {
          cell.value.setFields(value);
          return cell.value;
        }
        return cell.value;
      } else {
        const oldName = cell.value.name;
        if (value === '' || !NameValidator.validate(value)) {
          cell.value.name = oldName;
        } else {
          cell.value.name = value;
        }
        return oldName;
      }
    };
  }

  setLayoutForSwimlane() {
    this.editor.createSwimlaneLayout = () => {
      const layout = new mxStackLayout(this.graph, false);
      layout.fill = true;
      layout.resizeParent = true;

      layout.isVertexMovable = (cell) => {
        return true;
      };
      return layout;
    };
  }

  setBehaviourOfRelationCreated() {
    const style = this.graph.stylesheet.getDefaultEdgeStyle();
    this.graph.addEdge = (edge, parent, source, target, index) => {
      if (Utility.isManyToManyRelation(this.graph.stylesheet.getDefaultEdgeStyle())) {
        if (source.value.isAbstract || target.value.isAbstract) {
          mxUtils.alert('Żadna z tabel nie może być abstrakcyjna');
          return null;
        }
        const firstPrimaryKey = Utility.getTablePrimaryKey(this.graph, source);
        const secondPrimaryKey = Utility.getTablePrimaryKey(this.graph, target);

        if (firstPrimaryKey == null || secondPrimaryKey == null) {
          mxUtils.alert('Obie tabele muszą mieć klucz główny');
          return null;
        }

        edge.setStyle(style.toString());
        edge.value = new Relation(source, target, firstPrimaryKey, secondPrimaryKey);
        return this.graph.addCell(edge, parent, index, source, target);
      } else if (Utility.isInheritanceRelation(this.graph.stylesheet.getDefaultEdgeStyle())) {
        source.value.parent = target.value;
        edge.value = 'Inheritance';
        edge.setStyle(style.toString());

        return this.graph.addCell(edge, parent, index, source, target);
      } else {
        if (source.value.isAbstract || target.value.isAbstract) {
          mxUtils.alert('Żadna z tabel nie może być abstrakcyjna');
          return null;
        }
        const primaryKey = Utility.getTablePrimaryKey(this.graph, target);

        if (primaryKey == null) {
          mxUtils.alert('Docelowa tabela musi mieć klucz główny');
          return null;
        }

        this.graph.getModel().beginUpdate();
        try {
          const column1 = this.graph.getModel().cloneCell(new Column('').getDefaultColumnCell());
          column1.value.name = primaryKey.value.name + '_FK';
          column1.value.type = primaryKey.value.type;
          column1.value.foreignKey = new ForeignKey(target, primaryKey, source, column1);

          edge.setStyle(style.toString());
          this.graph.addCell(column1, source);
          source.value.addColumn(column1.value);
          source = column1;
          target = primaryKey;

          return this.graph.addCell(edge, parent, index, source, target);
        } finally {
          this.graph.getModel().endUpdate();
        }
      }
      return null;
    };
  }

  setDeletedEdgeListener() {
    this.graph.addListener(mxEvent.REMOVE_CELLS, (sender, evt) => {
      const cells = evt.getProperty('cells');

      for (const cell of cells) {
        if (this.graph.getModel().isEdge(cell) && !cell.value) {
          const terminal = this.graph.getModel().getTerminal(cell, true);
          Utility.getTableCell(this.graph, terminal).value.deleteColumn(terminal.value);
          this.graph.getModel().remove(terminal);
        }
      }
    });
  }

  setValueForCell() {
    this.graph.convertValueToString = (cell) => {
      if (cell.value != null && cell.value.name != null) {
        return cell.value.name;
      }
      return null;
    };
  }

  setVisibleLabels() {
    this.graph.getLabel = (cell) => {
      if (this.graph.isHtmlLabel(cell)) {
        let label = '';

        if (cell.value.primaryKey) {
          label += '<img alt="primary key" src="assets/key.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.foreignKey) {
          label += '<img alt="primary key" src="assets/foreignKey.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.unique) {
          label += '<img alt="unique" src="assets/unique.png" width="16" height="16" align="top">&nbsp;';
        }

        if (cell.value.notNull) {
          label += '<img alt="not null" src="assets/notNull.png" width="16" height="16" align="top">&nbsp;';
        }

        return label + mxUtils.htmlEntities(cell.value.name, false) + ': typ ' +
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
