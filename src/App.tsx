import {Route, Routes} from "react-router-dom";
import {PageLayout} from "./components/PageLayout/PageLayout";
import {PaymentSlipsDetails} from "./screens/PaymentSlipDetails/PaymentSlipsDetails";
import {PaymentSlips} from "./screens/PaymentSlips/PaymentSlips";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<PaymentSlips />} />
        <Route path="/slips/:id" element={<PaymentSlipsDetails />} />
      </Route>
    </Routes>
  )
}
