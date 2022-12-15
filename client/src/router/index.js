import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../components/HomeComponent.vue')
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: () => import('../components/ContactList.vue')
    },
    {
      path: '/contact',
      name: 'ContactProfile',
      component: () => import('../components/ContactProfile.vue'),
      props: true
    },
    {
      path: '/contact_add',
      name: 'ContactAdd',
      component: () => import('../components/ContactInput.vue'),
      props: true
    },
    {
      path: '/contact_edit',
      name: 'ContactEdit',
      component: () => import('../components/ContactInput.vue'),
      props: true
    },
    {
      path: '/create_message',
      name: 'CreateMessage',
      component: () => import('../components/CreateMessage.vue'),
      props: true
    },
    {
      path: '/select_contacts',
      name: 'SelectContacts',
      component: () => import('../components/ContactSelect.vue'),
      props: true
    },
  ]

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes
});

export default router;
