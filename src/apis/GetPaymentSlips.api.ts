import {IPaymentSlip, SLIPS} from "../configs/data";
import {Sleep} from "../utils/Sleep.util";
import {IApiResult} from "./interfaces";

export async function GetPaymentSlipsApi(): Promise<IApiResult<IPaymentSlip[]>> {
  try {
    await Sleep(Math.round(Math.random() * 1999));
    return Promise.resolve({data: SLIPS});
  } catch (e) {
    const errorMessage = (e as Error).message
    return Promise.resolve({errorMessage: errorMessage})
  }
}
