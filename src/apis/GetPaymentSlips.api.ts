import {IPaymentSlip, SLIPS} from "../configs/data";
import {Sleep} from "../utils/Sleep.util";

export async function GetPaymentSlipsApi(): Promise<IPaymentSlip[]> {
  try {
    await Sleep(Math.round(Math.random() * 1999));
    return Promise.resolve(SLIPS);
  } catch (e) {
    return Promise.reject(e);
  }
}
