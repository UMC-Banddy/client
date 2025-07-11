import CustomButton from '@/shared/ui/atoms/CustomButton';
import star2 from '@/assets/logos/Star 2.svg';

interface JoinBandModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const JoinBandModal = ({ open, onClose, onConfirm }: JoinBandModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-sm flex flex-col items-center">
        <img src={star2} alt="star" width={48} height={48} className="mb-2" />
        <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
          밴드에 조인하시겠습니까?
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          밴드 모임 채팅방에 참가합니다.
        </p>
        <div className="flex gap-3 w-full">
          <CustomButton
            onClick={onClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            아니요
          </CustomButton>
          <CustomButton onClick={onConfirm}>예</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default JoinBandModal;
