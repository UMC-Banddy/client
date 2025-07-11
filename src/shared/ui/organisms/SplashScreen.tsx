import splashImg from '@/assets/splash-main.png';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <img
        src={splashImg}
        alt="Splash"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
