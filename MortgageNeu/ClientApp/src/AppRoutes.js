import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import LoanCalculator from "./components/LoanCalculator";

const AppRoutes = [
  {
    index: true,
    element: <LoanCalculator />
  },
  {
    path: '/loan-calculator',
    element: <LoanCalculator />
  }
];

export default AppRoutes;
