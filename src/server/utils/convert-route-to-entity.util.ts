const mapping: Record<string, string> = {
  reservations: 'reservation',
  restaurants: 'restaurant',
  'table-layouts': 'table_layout',
  users: 'user',
  waiters: 'waiter',
  'waiter-assignments': 'waiter_assignment',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
