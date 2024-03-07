import {useQuery} from "@tanstack/react-query";
import {IPaymentSlips} from "./interfaces";
import {GetPaymentSlipsApi} from "../../apis/GetPaymentSlips.api";
import moment from "moment";
import './styles.scss'
import {
  IonCard,
  IonCardContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonSpinner
} from "@ionic/react";
import {Link} from "react-router-dom";


export const PaymentSlips: IPaymentSlips = function PaymentSlips() {
  const {data} = useQuery({queryKey: ['slips'], queryFn: GetPaymentSlipsApi});

  if (data) {
    return (
      <IonPage>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>Payment Slips</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Payment Slips</IonTitle>
            </IonToolbar>
          </IonHeader>
          <main className="payment-slips-page">
            <ol className="payment-slips">
              {data.map(i => (
                <li className="payment-slip" key={`ps-${i.id}`}>
                  <Link to={`/slips/${i.id}`} className="payment-slip-link">
                    <IonCard>
                      <IonCardContent>
                        <span className="payment-slip-label">{moment(i.fromDate).format('DD MMM YYYY')} to {moment(i.toDate).format('DD MMM YYYY')}</span>
                      </IonCardContent>
                    </IonCard>
                  </Link>
                </li>
              ))}
            </ol>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Payment Slips</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Payment Slips</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main className="payment-slips-page-loading">
          <IonSpinner />
        </main>
      </IonContent>
    </IonPage>
  )
}
