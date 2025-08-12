export interface PaginationEntity<T> {
  data: T[];
  count: number;
  beforeId?: string | null;
  hasNext?: boolean;
  hasPrevious?: boolean;
}
