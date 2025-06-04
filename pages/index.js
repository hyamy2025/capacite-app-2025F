import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full text-center">
        <Image
          src="/logo.png"
          alt="Ministère de l'Emploi et de la Formation Professionnelle"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Diagnostic de la Capacité d’Accueil
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
          <button
            onClick={() => router.push('/tda')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow"
          >
            Test de dépassement actuel
          </button>
          <button
            onClick={() => router.push('/tdp')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow"
          >
            Test de dépassement prévu
          </button>
        </div>
        <p className="text-sm text-gray-500">Version du programme : <strong>V1.0</strong></p>
      </div>
    </div>
  );
}

