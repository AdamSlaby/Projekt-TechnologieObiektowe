export abstract class ColumnType {
  static getAllColumnTypes() {
    return ['CHAR(1)', 'VARCHAR(255)', 'BINARY(1)', 'VARBINARY(255)', 'TINYBLOB', 'TINYTEXT', 'TEXT', 'BLOB', 'MEDIUMTEXT', 'MEDIUMTEXT',
      'MEDIUMBLOB', 'LONGTEXT', 'LONGBLOB', 'BIT(1)', 'TINYINT(255)', 'BOOL', 'BOOLEAN', 'SMALLINT(255)', 'MEDIUMINT(255)', 'INT',
      'BIGINT(255)', 'FLOAT(10,2)', 'DOUBLE(10,4)', 'DECIMAL(10,2)', 'DATE', 'DATETIME', 'TIME'];
  }
}
