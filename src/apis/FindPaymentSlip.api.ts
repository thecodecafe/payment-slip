import {IPaymentSlip, SLIPS} from "../configs/data";
import {Sleep} from "../utils/Sleep.util";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";

export async function FindPaymentSlipApi(id: string): Promise<IPaymentSlip> {
 try {
   await Sleep(Math.round(Math.random() * 1999));
   const slip = SLIPS.find(i => i.id === id);
   if (!slip) {
    throw new ResourceNotFoundError('Payment slip not found.');
   }
  return Promise.resolve(slip);
 } catch (e) {
  return Promise.reject(e)
 }
}
