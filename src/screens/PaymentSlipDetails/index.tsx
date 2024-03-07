import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonAlert
} from "@ionic/react";
import {Capacitor} from '@capacitor/core';
import {Filesystem, Directory} from '@capacitor/filesystem';
import {chevronBack} from 'ionicons/icons';
import {IPaymentSlipDetails} from "./interfaces";
import './styles.scss';
import {useCallback, useMemo, useState, useRef, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {FindPaymentSlipApi} from "../../apis/FindPaymentSlip.api";
import moment from "moment";
import axios, {Canceler} from "axios";

export const PaymentSlipsDetails: IPaymentSlipDetails = function PaymentSlipsDetails() {
  let {id} = useParams();
  const {data, error, refetch} = useQuery({
    queryKey: ["paymentSlip", id],
    queryFn: () => FindPaymentSlipApi(id || ''),
  });
  const notFound = useMemo(() => /found/.test(error?.message || ''), [error?.message]);
  const canGoBack = useMemo(() => window.history.length > 1, []);

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
              <BackButton canGoBack={canGoBack} onClick={handleLeave} />
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
              <BackButton canGoBack={canGoBack} onClick={handleLeave} />
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
              <BackButton canGoBack={canGoBack} onClick={handleLeave} />
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

const BackButton: React.FC<{
  canGoBack?: boolean;
  onClick(): void;
}> = function BackButton({canGoBack, onClick}) {
  return (
    <IonButton onClick={onClick}>
    {canGoBack ? (
      <>
        <IonIcon slot="start" icon={chevronBack} />
        {Capacitor.getPlatform() === 'ios' ? 'Go Back' : ''}
      </>
    ) : "Go Home"}
  </IonButton>
  )
}

const DownloadButton: React.FC<{url: string; fileName: string}> = function DownloadButton({url, fileName}) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const cancelHttp = useRef<Canceler | null>(null);
  const errorAlertRef = useRef<HTMLIonAlertElement | null>(null);
  const successAlertRef = useRef<HTMLIonAlertElement | null>(null);
  const ac = useRef<AbortController>();
  const [error, setError] = useState<string | null>(null);

  const getFileName = useCallback(() => {
    let name = fileName;
    name = name.replace(/\\\//g, "/");
    return name.replace(/\//g, "-")
  }, [fileName]);

  const getFileNameWithExtension = useCallback(() => {
    const urlSegments = url.split('.');
    const ext = urlSegments[urlSegments.length - 1];
    let name = `${getFileName()}.${ext}`;
    name = name.replace(/\\\//g, "/");
    return name.replace(/\//g, "-")
  }, [getFileName, url]);

  const handleWebDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      setIsPending(true);
      const cancelToken = new axios.CancelToken(c => cancelHttp.current = c);
      const response = await axios.get(url, {responseType: 'blob', cancelToken});

      // Create blob link to download
      const objUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = objUrl;
      link.setAttribute('download', getFileNameWithExtension());
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setIsPending(false);
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      setError((e as Error).message)
      setIsPending(false);
      errorAlertRef.current?.present();
    }
  }, [getFileNameWithExtension, isPending, url]);

  const handleAndroidDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      let perm = await Filesystem.checkPermissions();
      if (perm.publicStorage !== 'granted') {
        perm = await Filesystem.requestPermissions();
      }
      if (perm.publicStorage !== 'granted') {
        throw new Error('Please grant app permission to store files.');
      }
      setIsPending(true);
      const abortController = new AbortController();
      ac.current = abortController;
      await Filesystem.downloadFile({
        url: url,
        path: `Downloads/${getFileNameWithExtension()}`,
        directory: Directory.Documents,
        recursive: true,
      })
      if (abortController.signal.aborted) {
        return;
      }
      setIsPending(false);
      successAlertRef.current?.present()
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      setError((e as Error).message)
      setIsPending(false);
      errorAlertRef.current?.present();
    }
  }, [getFileNameWithExtension, isPending, url]);

  const handleIosDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      setIsPending(true);
      const abortController = new AbortController();
      ac.current = abortController;
      await Filesystem.downloadFile({
        url: url,
        path: getFileNameWithExtension(),
      })
      if (abortController.signal.aborted) {
        return;
      }
      setIsPending(false);
      successAlertRef.current?.present()
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      setError((e as Error).message)
      setIsPending(false);
      errorAlertRef.current?.present();
    }
  }, [getFileNameWithExtension, isPending, url]);

  const handleDownload = useCallback(() => {
    switch (Capacitor.getPlatform()) {
      case 'ios':
        return handleIosDownload();
      case 'android':
        return handleAndroidDownload();
      case 'web':
        return handleWebDownload();
      default:
        return;
    }
  }, [handleAndroidDownload, handleIosDownload, handleWebDownload]);

  useEffect(function componentDidMount() {
    return function componentWillUnmount() {
      if (cancelHttp.current) {
        cancelHttp.current();
      }
      if (ac.current?.signal.aborted === false) {
        ac.current.abort();
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
        ref={errorAlertRef}
        header="Failed to Download"
        message={error || "We were unable to download your slip. Please check your internet connection and try again."}
        buttons={['Dismiss']}
      ></IonAlert>
      <IonAlert
        ref={successAlertRef}
        header="Success"
        message={"Successfully downloaded the Payment Slip."}
        buttons={['Dismiss']}
      ></IonAlert>
    </>
  )
}
