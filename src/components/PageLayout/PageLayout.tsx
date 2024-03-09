import {Outlet} from 'react-router-dom';
import './styles.scss';
import {IPageLayout} from './interfaces';

export const PageLayout: IPageLayout = function PageLayout() {
  return (
    <main className="page">
      <Outlet />
    </main>
  );
};
