import { Router } from '@vaadin/router';

export function setupRouter(outlet) {
  const router = new Router(outlet);

  router.setRoutes([
    { path: '/', component: 'list-employee' },
    { path: '/add', component: 'manage-employee' },
    { path: '/details/:id', component: 'manage-employee' },
    { path: '(.*)', component: 'not-found-view' },
  ]);

  return router;
}