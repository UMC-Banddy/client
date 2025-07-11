import { Dialog } from '@mui/material';

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Modal = ({ children, open, setOpen }: ModalProps) => {
  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '14px',
        },
      }}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
