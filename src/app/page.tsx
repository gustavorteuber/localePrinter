"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import useGeolocation from '../hooks/useGeolocation';
import styles from './Home.module.css';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Home: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [runCompleted, setRunCompleted] = useState<boolean>(false);
  const positions = useGeolocation(isRunning);

  const startRun = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionDenied(false);
          setIsRunning(true);
          setRunCompleted(false);
        },
        (error) => {
          console.error(error);
          if (error.code === 1) {
            setPermissionDenied(true);
            alert('You need to allow location access to start the run.');
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const stopRun = () => {
    setIsRunning(false);
    setRunCompleted(true);
  };

  const simulateRoute = () => {
    const fakeRoute: number[][] = [
      [-22.9035, -43.2096], // Rio de Janeiro
      [-23.5505, -46.6333], // São Paulo
    ];

    setRunCompleted(false);
    setIsRunning(true);
    positions.splice(0, positions.length, ...fakeRoute);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Simulação de Viagem</h1>
      <div className={styles.buttons}>
        <button onClick={startRun} disabled={isRunning || runCompleted} className={styles.startButton}>
          Iniciar Viagem
        </button>
        <button onClick={stopRun} disabled={!isRunning} className={styles.stopButton}>
          Parar Viagem
        </button>
        <button onClick={simulateRoute} disabled={isRunning || runCompleted} className={styles.startButton}>
          Simular Rota
        </button>
      </div>
      {isRunning && <p className={styles.status}>Viagem em andamento...</p>}
      {runCompleted && <p className={styles.status}>Viagem concluída!</p>}
      {!isRunning && positions.length > 0 && !permissionDenied && <Map positions={positions} />}
      {permissionDenied && <p className={styles.error}>Por favor, habilite os serviços de localização para iniciar uma viagem.</p>}
    </div>
  );
}

export default Home;
