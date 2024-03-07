import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner, IonAlert} from "@ionic/react";
import {chevronBack} from 'ionicons/icons';
import {IPaymentSlipDetails} from "./interfaces";
import './styles.scss';
import {useCallback, useMemo, useState, useRef, useEffect} from "react";
import fileDownload from 'js-file-download'
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {FindPaymentSlipApi} from "../../apis/FindPaymentSlip.api";
import moment from "moment";
import axios, {Canceler} from "axios";

export const PaymentSlipsDetails: IPaymentSlipDetails = function PaymentSlipsDetails() {
  let {id} = useParams();

  const {data, error, refetch} = useQuery({queryKey: ["paymentSlip", id], queryFn: () => FindPaymentSlipApi(id || '')});

  const notFound = useMemo(() => {
    return /found/.test(error?.message || '');
  }, [error?.message]);

  const canGoBack = useMemo(() => {
    return window.history.length > 1;
  }, [])

  const handleTryAgain = useCallback(() => {
    refetch({
      cancelRefetch: true,
    })
  }, [refetch]);

  const handleLeave = useCallback(() => {
    if (canGoBack) {
      return window.history.back();
    }
    window.history.replaceState({}, '', '/')
  }, [canGoBack]);

  if (data) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleLeave}>
                {canGoBack ? (
                  <>
                    <IonIcon slot="start" icon={chevronBack} />
                    Go Back
                  </>
                ) : "Go Home"}
              </IonButton>
            </IonButtons>
            <IonTitle>Payment Slip Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="payment-slip-details">
          <main className="content-container">
            <div className="slip-id">
              <span className="label">ID:</span> <span className="value">{data.id}</span>
            </div>
            <div className="date-range">
              <div className="date-item">
                <span className="date-label">From</span>
                <span className="date-value">{moment(data.fromDate).format('ddd Do MMM, YYYY')}</span>
              </div>
              <div className="date-item">
                <span className="date-label">To</span>
                <span className="date-value">{moment(data.toDate).format('ddd Do MMM, YYYY')}</span>
              </div>
            </div>
            <DownloadButton
              fileName={`payment-slip-${moment(data.fromDate).format("DD/MM/YYYY")}-${moment(data.toDate).format("DD/MM/YYYY")}`}
              url={data.file}
            />
          </main>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleLeave}>
                {canGoBack ? (
                  <>
                    <IonIcon slot="start" icon={chevronBack} />
                    Go Back
                  </>
                ) : "Go Home"}
              </IonButton>
            </IonButtons>
            <IonTitle>Payment Slip Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="payment-slip-details-error">
          <main className="content-container">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle className="error-title">{notFound ? 'Not Found' : 'Error'}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p className="error-message">{error.message}</p>
                {notFound
                  ? (
                    <IonButton onClick={handleLeave} expand="block">{canGoBack ? "Go Back" : "Go Home"}</IonButton>
                  ) : (
                    <IonButton onClick={handleTryAgain} expand="block">Try again</IonButton>
                  )}
              </IonCardContent>
            </IonCard>
          </main>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleLeave}>
              {canGoBack ? (
                <>
                  <IonIcon slot="start" icon={chevronBack} />
                  Go Back
                </>
              ) : "Go Home"}
            </IonButton>
          </IonButtons>
          <IonTitle>Payment Slip Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="payment-slip-details">
        <main className="payment-slip-details-loading">
          <IonSpinner />
        </main>
      </IonContent>
    </IonPage>
  );
}

const DownloadButton: React.FC<{url: string; fileName: string}> = function DownloadButton({url, fileName}) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const cancelHttp = useRef<Canceler | null>(null);
  const alertRef = useRef<HTMLIonAlertElement | null>(null);

  const handleDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      setIsPending(true);
      const cancelToken = new axios.CancelToken(c => cancelHttp.current = c);
      const response = await axios.get(url, {headers: {'Content-Type': 'blob'}, cancelToken});
      fileDownload(response.data, fileName);
      setIsPending(false);
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      setIsPending(false);
      alertRef.current?.present();
    }
    if (isPending) {
      return;
    }
  }, [fileName, isPending, url]);

  useEffect(function componentDidMount() {
    return function componentWillUnmount() {
      if (cancelHttp.current) {
        cancelHttp.current();
      }
    }
  }, [])

  return (
    <>
      <IonButton
        expand="block" onClick={handleDownload}>
        {isPending ? <IonSpinner color="secondary" /> : 'Download'}
      </IonButton>
      <IonAlert
        ref={alertRef}
        trigger="present-alert"
        header="Failed to Download"
        message="We were unable to download your slip. Please check your internet connection and try again."
        buttons={['Dismiss']}
      ></IonAlert>
    </>
  )
}
