export abstract class NameValidator {
  private static reservedWords = ['ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC', 'AUTO_INCREMENT', 'BDB', 'BERKELEYDB',
    'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOTH', 'BTREE', 'BY', 'CASCADE', 'CASE', 'CHANGE', 'CHAR', 'CHARACTER',
    'CHECK', 'COLLATE', 'COLUMN', 'COLUMNS', 'CONSTRAINT', 'CREATE', 'CROSS', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
    'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DEFAULT', 'DELAYED', 'DELETE', 'DESC', 'DESCRIBE',
    'DISTINCT', 'DISTINCTROW', 'DIV', 'DOUBLE', 'DROP', 'ELSE', 'ENCLOSED', 'ERRORS', 'ESCAPED', 'EXISTS', 'EXPLAIN', 'FALSE', 'FIELDS',
    'FLOAT', 'FOR', 'FORCE', 'FOREIGN', 'FROM', 'FULLTEXT', 'FUNCTION', 'GEOMETRY', 'GRANT', 'GROUP', 'HASH', 'HAVING', 'HELP',
    'HIGH_PRIORITY', 'HOUR_MINUTE', 'HOUR_SECOND', 'IF', 'IGNORE', 'IN', 'INDEX', 'INFILE', 'INNER', 'INNODB', 'INSERT', 'INT',
    'INTEGER', 'INTERVAL', 'INTO', 'IS', 'JOIN', 'KEY', 'KEYS', 'KILL', 'LEADING', 'LEFT', 'LIKE', 'LIMIT', 'LINES', 'LOAD', 'LOCALTIME',
    'LOCALTIMESTAMP', 'LOCK', 'LONG', 'LONGBLOB', 'LONGTEXT', 'LOW_PRIORITY', 'MASTER_SERVER_ID', 'MATCH', 'MEDIUMBLOB', 'MEDIUMINT',
    'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_SECOND', 'MOD', 'MRG_MYISAM', 'NATURAL', 'NOT', 'NULL', 'NUMERIC', 'ON', 'OPTIMIZE', 'OPTION',
    'OPTIONALLY', 'OR', 'ORDER', 'OUTER', 'OUTFILE', 'PRECISION', 'PRIMARY', 'PRIVILEGES', 'PROCEDURE', 'PURGE', 'READ', 'REAL',
    'REFERENCES', 'REGEXP', 'RENAME', 'REPLACE', 'REQUIRE', 'RESTRICT', 'RETURNS', 'REVOKE', 'RIGHT', 'RLIKE', 'RTREE', 'SELECT', 'SET',
    'SHOW', 'SMALLINT', 'SOME', 'SONAME', 'SPATIAL', 'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL', 'STARTING',
    'STRAIGHT_JOIN', 'STRIPED', 'TABLE', 'TABLES', 'TERMINATED', 'THEN', 'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRUE',
    'TYPES', 'UNION', 'UNIQUE', 'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE', 'USE', 'USER_RESOURCES', 'USING', 'VALUES', 'VARBINARY',
    'VARCHAR', 'VARCHARACTER', 'VARYING', 'WARNINGS', 'WHEN', 'WHERE', 'WITH', 'WRITE', 'XOR', 'YEAR_MONTH', 'ZEROFILL'];

  private static validateLength(name): boolean {
    if (name.length > 63) {
      return false;
    }
    return true;
  }

  static validate(name: string): boolean {
    if (!this.validateLength(name)) {
      return false;
    }
    if (!new RegExp('^[0-9a-zA-Z$_]+$').test(name)) {
      return false;
    }
    return !this.isNameReserved(name);
  }

  static isNameReserved(name): boolean {
    let isReserved = false;
    this.reservedWords.forEach(word => {
      if (word.toLowerCase() === name.toLowerCase()) {
        isReserved = true;
        return;
      }
    });
    return isReserved;
  }
}
