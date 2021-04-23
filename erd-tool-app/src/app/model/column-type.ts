export abstract class ColumnType {
  static getAllColumnTypes() {
    return ['CHAR', 'VARCHAR(255)', 'BINARY', 'VARBINARY', 'TINYBLOB', 'TINYTEXT', 'TEXT', 'BLOB', 'MEDIUMTEXT', 'MEDIUMTEXT',
      'MEDIUMBLOB', 'LONGTEXT', 'LONGBLOB', 'BIT', 'TINYINT', 'BOOL', 'BOOLEAN', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER',
      'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'DATE', 'DATETIME', 'TIME'];
  }
}
