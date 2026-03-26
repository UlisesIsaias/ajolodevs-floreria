import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito]   = useState({ items: [], total: '0.00' });
  const [cargando, setCargando] = useState(false);
  const { usuario }             = useAuth();

  const obtenerCarrito = async () => {
    if (!usuario) return;
    try {
      const { data } = await api.get('/carrito');
      setCarrito(data);
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
  };

  const agregarAlCarrito = async (producto_id, cantidad = 1) => {
    setCargando(true);
    try {
      await api.post('/carrito', { producto_id, cantidad });
      await obtenerCarrito();
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: error.response?.data?.mensaje };
    } finally {
      setCargando(false);
    }
  };

  const eliminarItem = async (producto_id) => {
    try {
      await api.delete(`/carrito/item/${producto_id}`);
      await obtenerCarrito();
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const vaciarCarrito = async () => {
    try {
      await api.delete('/carrito/vaciar');
      setCarrito({ items: [], total: '0.00' });
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
    }
  };

  useEffect(() => {
    if (usuario) obtenerCarrito();
    else setCarrito({ items: [], total: '0.00' });
  }, [usuario]);

  return (
    <CartContext.Provider value={{ carrito, cargando, obtenerCarrito, agregarAlCarrito, eliminarItem, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);