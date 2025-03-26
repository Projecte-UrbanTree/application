import { toast } from 'react-toastify';
import { setContract } from '../features/contractSlice';

const checkContractMiddleware = (store) => (next) => (action) => {
  // Si l'usuari intenta accedir sense contracte seleccionat
  if (action.type === setContract.type && !action.payload) {
    toast.error('No tens cap contracte disponible. Contacta amb suport.');
  }

  return next(action);
};

export default checkContractMiddleware;
