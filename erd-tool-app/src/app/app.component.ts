import {AfterViewInit, Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {faProjectDiagram, faTable} from '@fortawesome/free-solid-svg-icons';
import {Styles} from './styles/vertex-styles';
import {Table} from './model/table';
import {Settings} from './settings/settings';
import {ContextMenu} from './menu/context-menu';
import {Utility} from './logic/utility';
import {ColumnType} from './model/column-type';
import {ArrowStyle} from './styles/arrow-style';
import {Relation} from './enums/relation.enum';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

declare var mxEditor: any;
declare var mxEvent: any;
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
  columnTypes = ColumnType.getAllColumnTypes().sort();
  column;
  chosenCell;
  modalRef: BsModalRef;
  chosenTableName: string;
  graph;
  model;
  isForeignKeyClicked = false;
  sqlCode = '';
  relation = Relation;
  radioModel = 'OneToOne';
  settings: Settings;
  isColumnClicked = false;

  constructor(private modalService: BsModalService) {
  }

  @ViewChild('graphContainer') graphContainer: ElementRef;

  ngAfterViewInit() {
    this.editor.setGraphContainer(this.graphContainer.nativeElement);
    this.graph = this.editor.graph;
    this.model = this.graph.getModel();

    this.settings = new Settings(this.editor);
    this.settings.setGeneralSettings();
    this.settings.setCellHtmlLabel();
    this.settings.setCellProperties();
    this.settings.setLogicForCellValueChanged();
    this.settings.setValueForCell();
    this.settings.setVisibleLabels();
    this.settings.setLayoutForSwimlane();
    this.settings.setBehaviourOfRelationCreated();
    this.settings.setDeletedEdgeListener();
    this.addSideFormListener();

    this.graph.getStylesheet().putDefaultVertexStyle(Styles.getColumnStyle());
    this.graph.getStylesheet().putCellStyle('table', Styles.getTableStyle());
    ArrowStyle.addOneToManyArrow();
    Styles.setOneToOneEdgeStyle(this.graph);


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
    const entity = table.getTableCell();
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

  changeRelationType(relation: Relation) {
    switch (relation) {
      case Relation.ONE_TO_ONE:
        Styles.setOneToOneEdgeStyle(this.graph);
        break;
      case Relation.ONE_TO_MANY:
        Styles.setOneToManyEdgeStyle(this.graph);
        break;
      case Relation.MANY_TO_MANY:
        Styles.setManyToManyEdgeStyle(this.graph);
        break;
      case Relation.INHERITANCE:
        Styles.setInheritanceEdgeStyle(this.graph);
    }
  }

  addSideFormListener() {
    this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
      const cell = evt.getProperty('cell');
      const event = evt.getProperty('event');
      if (Utility.isColumnClicked(cell, this.graph, event)) {
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

  openModal(template: TemplateRef<any>) {
    this.sqlCode = '';
    if (this.isErdValid()) {
      this.generateSql();
      this.modalRef = this.modalService.show(template);
    } else {
      alert('Nazwy tabel muszą być unikalne oraz nazwy kolumn w danej tabeli muszą być unikalne');
      console.error('Nazwy tabel muszą być unikalne oraz nazwy kolumn w danej tabeli muszą być unikalne');
    }
  }

  generateSql() {
    const parent = this.graph.getDefaultParent();
    const childCount = this.model.getChildCount(parent);
    let relations = '';

    for (let i = 0; i < childCount; i++) {
      const child = this.model.getChildAt(parent, i);

      if (!this.model.isEdge(child) && !child.value.isAbstract) {
        this.sqlCode += '\nCREATE TABLE IF NOT EXISTS ' + child.value.name + ' (';
        this.sqlCode += child.value.generateSql();
        child.value.columns.forEach(column => {
          if (column.foreignKey) {
            relations += column.foreignKey.generateSql();
          }});
        this.sqlCode = this.sqlCode.slice(0, -1);
        this.sqlCode += '\n);';
        this.sqlCode += '\n';
      } else if (this.model.isEdge(child) && child.value) {
        this.sqlCode += child.value.generateSql();
      }
    }
    this.sqlCode += relations;
  }

  isErdValid(): boolean {
    const parent = this.graph.getDefaultParent();
    const childCount = this.model.getChildCount(parent);
    const tableNames = new Set<string>();
    const columnNames = new Set<string>();

    for (let i = 0; i < childCount; i++) {
      const child = this.model.getChildAt(parent, i);
      if (!this.model.isEdge(child)) {
        if (!tableNames.has(child.value.name)) {
          tableNames.add(child.value.name);
        } else {
          return false;
        }
        const columnCount = this.model.getChildCount(child);

        for (let j = 0; j < columnCount; j++) {
          const column = this.model.getChildAt(child, j).value;
          if (!columnNames.has(column.name)) {
            columnNames.add(column.name);
          } else {
            return false;
          }
        }
        columnNames.clear();
      }
    }
    return true;
  }
}
