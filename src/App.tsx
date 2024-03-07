import {Route, Routes} from "react-router-dom";
import {Page} from "./components/Page";
import {PaymentSlipsDetails} from "./screens/PaymentSlipDetails";
import {PaymentSlips} from "./screens/PaymentSlips";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Page />}>
        <Route index element={<PaymentSlips />} />
        <Route path="/slips/:id" element={<PaymentSlipsDetails />} />
      </Route>
    </Routes>
  )
}
