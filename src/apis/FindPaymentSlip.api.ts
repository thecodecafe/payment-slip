import {IPaymentSlip, SLIPS} from "../configs/data";
import {Sleep} from "../utils/Sleep.util";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {IApiResult} from "./interfaces";

export async function FindPaymentSlipApi(id: string): Promise<IApiResult<IPaymentSlip>> {
 try {
   await Sleep(Math.round(Math.random() * 1999));
   const slip = SLIPS.find(i => i.id === id);
   if (!slip) {
    throw new ResourceNotFoundError('Payment slip not found.');
   }
  return Promise.resolve({data: slip});
 } catch (e) {
    const errorMessage = (e as Error).message;
    return Promise.resolve({errorMessage});
 }
}
