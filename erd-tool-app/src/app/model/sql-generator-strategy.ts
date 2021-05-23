export interface SqlGeneratorStrategy {
  generateSql(isInherited?: boolean): string;
}
