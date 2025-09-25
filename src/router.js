import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AboutPage from './components/AboutPage.vue';
import ContactPage from './components/ContactPage.vue';
import RoomList from './components/RoomList.vue';
import BookingList from './components/BookingList.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import ViewRoom from './components/ViewRoom.vue';
import ViewBooking from './components/ViewBooking.vue';

const routes = [
  { path: '/', component: HomePage },          
  { path: '/about', component: AboutPage },    
  { path: '/contact', component: ContactPage },
  { path: '/rooms', component: RoomList },
  { path: '/bookings', component: BookingList },
  { path: '/login', component: LoginPage },    
  { path: '/register', component: RegisterPage }, 
  { path: '/view-rooms/:id', component: ViewRoom },
  { path: '/view-bookings/:id', component: ViewBooking },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;