import {Column} from '../model/column';

export abstract class Utility {
  static getTableCell(graph, cell) {
    if (graph.isSwimlane(cell)) {
      return cell;
    } else {
      return cell.getParent();
    }
  }
}
