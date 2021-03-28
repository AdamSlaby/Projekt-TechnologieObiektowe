declare var mxConstants: any;

export abstract class Styles {
  static getEntityStyle() {
    const style = new Object();
    style[mxConstants.STYLE_SHAPE] = 'table';
    style[mxConstants.DEFAULT_STARTSIZE] = '30';
    style[mxConstants.STYLE_ALIGN] = 'center';
    style[mxConstants.STYLE_FILLCOLOR] = '#3399ff';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    return style;
  }
}
