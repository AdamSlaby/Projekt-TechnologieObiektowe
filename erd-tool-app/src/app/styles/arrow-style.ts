declare var mxMarker: any;

export abstract class ArrowStyle {
  static getOneToManyArrow() {
    mxMarker.addMarker('oneToMany', (canvas, shape, type, pe, unitX, unitY, size, source, sw, filled) => {
      const nx = unitX * (size + sw + 9);
      const ny = unitY * (size + sw + 9);

      return () => {
        canvas.begin();
        canvas.moveTo(pe.x - nx - ny / 2, pe.y - ny + nx / 2);
        canvas.moveTo(pe.x + ny / 2, pe.y - nx / 2);
        canvas.lineTo(pe.x - nx, pe.y - ny);
        canvas.lineTo(pe.x - ny / 2, pe.y + nx / 2);
        canvas.stroke();
      };
    });
  }
}
