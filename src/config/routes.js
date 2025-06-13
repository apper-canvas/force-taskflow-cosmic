import HomePage from '@/components/pages/HomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import CategoriesPage from '@/components/pages/CategoriesPage';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: HomePage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
component: CalendarPage
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tag',
component: CategoriesPage
  }
};

export const routeArray = Object.values(routes);