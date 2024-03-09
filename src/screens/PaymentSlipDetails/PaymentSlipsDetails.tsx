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
  const errorAlert = useRef<HTMLIonAlertElement | null>(null);
  const successAlert = useRef<HTMLIonAlertElement | null>(null);
  const abortController = useRef<AbortController>();
  const [error, setError] = useState<string | null>(null);

  const getCleanedFileName = useCallback(() => {
    let name = fileName;
    name = name.replace(/\\\//g, "/");
    name = name.replace(/\//g, "-");
    return name
  }, [fileName]);

  const getFileNameWithExtension = useCallback(() => {
    const urlSegments = url.split('.');
    const ext = urlSegments[urlSegments.length - 1];
    let name = `${getCleanedFileName()}.${ext}`;
    name = name.replace(/\\\//g, "/");
    return name.replace(/\//g, "-")
  }, [getCleanedFileName, url]);

  const handleWebDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      setIsPending(true);
      // make request and download file as blob
      const cancelToken = new axios.CancelToken(c => cancelHttp.current = c);
      const response = await axios.get(url, {responseType: 'blob', cancelToken});
      // create object url from blob for download
      const objectUrl = window.URL.createObjectURL(response.data);
      // create link element
      const linkTag = document.createElement('a');
      linkTag.href = objectUrl;
      linkTag.setAttribute('download', getFileNameWithExtension());
      document.body.appendChild(linkTag);
      // download file and delete tag
      linkTag.click();
      linkTag.parentNode?.removeChild(linkTag);
      setIsPending(false);
    } catch (e) {
      // stop if request was cancelled
      if (axios.isCancel(e)) {
        return;
      }
      setError((e as Error).message)
      errorAlert.current?.present();
      setIsPending(false);
    }
  }, [getFileNameWithExtension, isPending, url]);

  const handleAndroidDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      // stop if permission was not granted
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage !== 'granted') {
        throw new Error('Please grant app permission to store files.');
      }
      setIsPending(true);
      // download the file to the Downloads folder
      const localAbortController = new AbortController();
      abortController.current = localAbortController;
      await Filesystem.downloadFile({
        url: url,
        path: `Download/${getFileNameWithExtension()}`,
        directory: Directory.ExternalStorage,
      })
      // stop if action was cancelled
      if (localAbortController.signal.aborted) {
        return;
      }
      successAlert.current?.present()
      setIsPending(false);
    } catch (e) {
      setError((e as Error).message)
      errorAlert.current?.present();
      setIsPending(false);
    }
  }, [getFileNameWithExtension, isPending, url]);

  const handleIosDownload = useCallback(async () => {
    try {
      if (isPending) {
        return;
      }
      setIsPending(true);
      // download the file to Documents in File app
      const localAbortController = new AbortController();
      abortController.current = localAbortController;
      await Filesystem.downloadFile({
        url: url,
        path: getFileNameWithExtension(),
      });
      // stop if action as aborted
      if (localAbortController.signal.aborted) {
        return;
      }
      successAlert.current?.present()
      setIsPending(false);
    } catch (e) {
      setError((e as Error).message)
      errorAlert.current?.present();
      setIsPending(false);
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
      if (abortController.current?.signal.aborted === false) {
        abortController.current.abort();
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
        ref={errorAlert}
        header="Download Failed"
        message={error || ''}
        buttons={['Dismiss']}
      ></IonAlert>
      <IonAlert
        ref={successAlert}
        header="Success"
        message="Successfully downloaded the Payment Slip."
        buttons={['Dismiss']}
      ></IonAlert>
    </>
  )
}
