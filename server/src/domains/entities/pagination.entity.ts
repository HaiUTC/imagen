export interface PaginationEntity<T> {
  data: T[];
  beforeId?: string | null;
  hasNext?: boolean;
  hasPrevious?: boolean;
}
