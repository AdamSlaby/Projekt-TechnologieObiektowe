export abstract class ColumnType {
  static getAllColumnTypes() {
    return ['CHAR(255)', 'VARCHAR(255)', 'BINARY(32)', 'VARBINARY(255)', 'TINYBLOB', 'TINYTEXT', 'TEXT', 'BLOB',
      'MEDIUMTEXT', 'MEDIUMBLOB', 'LONGTEXT', 'LONGBLOB', 'BIT(8)', 'TINYINT', 'BOOLEAN', 'MEDIUMINT',
      'INT', 'BIGINT', 'FLOAT(24)', 'DOUBLE', 'DECIMAL(9,2)', 'DATE', 'DATETIME', 'TIME'];
  }
}
