import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AboutPage from './components/AboutPage.vue';
import ContactPage from './components/ContactPage.vue';
import TelevisionList from './components/TelevisionList.vue';
import SaleList from './components/SaleList.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import ViewTelevision from './components/ViewTelevision.vue';
import ViewSale from './components/ViewSale.vue';

const routes = [
  { path: '/', component: HomePage },          
  { path: '/about', component: AboutPage },    
  { path: '/contact', component: ContactPage },
  { path: '/televisions', component: TelevisionList },
  { path: '/sales', component: SaleList },
  { path: '/login', component: LoginPage },    
  { path: '/register', component: RegisterPage }, 
  { path: '/view-televisions/:id', component: ViewTelevision },
  { path: '/view-sales/:id', component: ViewSale },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;