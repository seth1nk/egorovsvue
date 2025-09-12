import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AboutPage from './components/AboutPage.vue';
import ContactPage from './components/ContactPage.vue';
import RepairServiceList from './components/RepairServiceList.vue';
import BicycleList from './components/BicycleList.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import ViewRepairService from './components/ViewRepairService.vue';
import ViewBicycle from './components/ViewBicycle.vue';

const routes = [
  { path: '/', component: HomePage },          
  { path: '/about', component: AboutPage },    
  { path: '/contact', component: ContactPage },
  { path: '/repair-services', component: RepairServiceList },
  { path: '/bicycles', component: BicycleList },
  { path: '/login', component: LoginPage },    
  { path: '/register', component: RegisterPage }, 
  { path: '/view-repair-services/:id', component: ViewRepairService },
  { path: '/view-bicycles/:id', component: ViewBicycle },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;