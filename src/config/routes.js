import Home from '../pages/Home';
import Calendar from '../pages/Calendar';
import Categories from '../pages/Categories';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Home
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tag',
    component: Categories
  }
};

export const routeArray = Object.values(routes);