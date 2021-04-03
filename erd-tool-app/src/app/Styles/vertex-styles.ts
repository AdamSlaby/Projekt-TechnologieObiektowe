declare var mxConstants: any;
declare var mxPerimeter: any;
declare var mxEdgeStyle: any;

export abstract class Styles {
  static getEntityStyle() {
    const style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTSIZE] = '13';
    style[mxConstants.STYLE_FONTSTYLE] = 0;
    style[mxConstants.STYLE_SPACING_LEFT] = '4';
    return style;
  }

  static getTableStyle() {
    const table = new Object();
    table[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    table[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    table[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    table[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    table[mxConstants.STYLE_GRADIENTCOLOR] = '#41B9F5';
    table[mxConstants.STYLE_FILLCOLOR] = '#8CCDF5';
    table[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
    table[mxConstants.STYLE_STROKECOLOR] = '#1B78C8';
    table[mxConstants.STYLE_FONTCOLOR] = '#000000';
    table[mxConstants.STYLE_STROKEWIDTH] = '2';
    table[mxConstants.STYLE_STARTSIZE] = '30';
    table[mxConstants.STYLE_FONTSIZE] = '13';
    table[mxConstants.STYLE_FONTSTYLE] = 1;
    table[mxConstants.STYLE_SHADOW] = 1;
    return table;
  }

  static setEdgeStyle(graph) {
    const edge = graph.stylesheet.getDefaultEdgeStyle();
    edge[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
    edge[mxConstants.STYLE_STROKEWIDTH] = '2';
    edge[mxConstants.STYLE_ROUNDED] = true;
    edge[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
  }
}
