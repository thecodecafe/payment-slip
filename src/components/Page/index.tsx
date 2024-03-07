import {Outlet} from 'react-router-dom';
import './styles.scss';
import {IPage} from './interfaces';

export const Page: IPage = function Page({noHeader}) {
  return (
    <main className="page">
      <Outlet />
    </main>
  );
};
