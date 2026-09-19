export interface ActivityLogItem {
  id: string;
  module: string;
  entity: string;
  entityId: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  label: string;
  details: string | null;
  createdAt: string;
}
