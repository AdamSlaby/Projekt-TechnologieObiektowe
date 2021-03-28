export abstract class PopupMenu {
  static createPopupMenu(menu, editor, cell) {
    if (cell != null) {
      menu.addItem('Usuń', '@fortawesome/free-solid-svg-icons/faTrashAlt', () => editor.execute('delete', cell));
    }
  }
}
