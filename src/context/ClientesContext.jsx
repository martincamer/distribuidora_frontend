import { createContext, useContext, useEffect, useState } from "react";
import {
  getClienteRequest,
  getClientesRequest,
  createClienteRequest,
  deleteClienteRequest,
  updateClienteRequest,
  agregarComprobante,
  getClienteComprobantesRequest,
  updateClienteTotalRequest,
} from "../api/clientes"; // Asegúrate de tener las funciones de solicitud correctas
import { toast } from "react-toastify";

// Crear el contexto para clientes
const ClientesContext = createContext();

// Hook personalizado para usar el contexto de clientes
export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) throw new Error("Error al usar el context");
  return context;
};

// Proveedor del contexto de clientes
export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([]);

  // Obtener todos los clientes
  const getClientes = async () => {
    const res = await getClientesRequest();
    setClientes(res.data);
  };

  // Eliminar un cliente
  const deleteCliente = async (id) => {
    try {
      const res = await deleteClienteRequest(id);
      if (res.status === 204) {
        setClientes(clientes.filter((cliente) => cliente._id !== id));

        toast.error("Cliente eliminado correctamente", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Crear un nuevo cliente
  const createCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(cliente);
      const nuevoCliente = res.data;

      setClientes([...clientes, nuevoCliente]);

      toast.success("Cliente creado correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover,
        draggable,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createComprobante = async (id, data) => {
    try {
      const res = await agregarComprobante(id, data);

      toast.success("Comprobante creado", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover,
        draggable,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener un cliente por ID
  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener un cliente por ID
  const getComprobantesMensuales = async (id) => {
    try {
      const res = await getClienteComprobantesRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  // Actualizar un cliente
  const updateCliente = async (id, cliente) => {
    try {
      const res = await updateClienteRequest(id, cliente);

      const clientesActualizados = clientes.map((c) =>
        c._id === id ? res.data : c
      );

      setClientes(clientesActualizados);

      toast.success("Cliente actualizado correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover,
        draggable,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Actualizar solo el campo 'total' de un cliente
  const updateTotal = async (id, newTotal) => {
    try {
      const res = await updateClienteTotalRequest(id, newTotal);

      // Actualiza el cliente en el estado
      const clientesActualizados = clientes.map((c) =>
        c._id === id ? res.data : c
      );

      setClientes(clientesActualizados);

      toast.success("Total del cliente actualizado correctamente", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el total del cliente", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        setClientes,
        getClientes,
        deleteCliente,
        createCliente,
        getCliente,
        updateCliente,
        createComprobante,
        getComprobantesMensuales,
        updateTotal,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
}
