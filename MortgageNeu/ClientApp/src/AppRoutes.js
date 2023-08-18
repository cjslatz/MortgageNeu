import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import LoanCalculator from "./components/LoanCalculator";

const AppRoutes = [
  {
    index: true,
        element: <LoanCalculator />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
    },
    {
        path: '/loan-calculator',
        element: <LoanCalculator />
    }
];

export default AppRoutes;
