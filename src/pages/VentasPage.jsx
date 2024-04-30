import { useEffect } from "react";
import { useVentas } from "../context/VentasContext.jsx"; // Cambia a VentasContext
import { ImFileEmpty } from "react-icons/im"; // Icono para cuando no hay datos
import { BsFolderPlus } from "react-icons/bs"; // Icono para agregar
import { TableVentas } from "../components/ventas/TableVentas.jsx"; // Cambia a la tabla de ventas
import { IoIosAddCircleOutline } from "react-icons/io"; // Icono para agregar
import { Link } from "react-router-dom";

export function VentasPage() {
  const { ventas, getVentas } = useVentas(); // Cambia a ventas y función para obtener ventas

  useEffect(() => {
    getVentas(); // Obtiene las ventas cuando el componente se monta
  }, []); // No olvides agregar dependencias necesarias para evitar advertencias

  return (
    <div>
      {ventas.length === 0 && (
        <div className="flex flex-col gap-6 justify-center items-center p-10 bg-white w-1/3 mx-auto my-10 rounded-xl shadow">
          <div>
            <ImFileEmpty className="text-6xl text-sky-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              No hay ninguna venta registrada
            </h1>
          </div>
          <div>
            <Link
              to={"/crear-venta"}
              className="bg-sky-100 text-sky-600 py-3 px-6 rounded-2xl hover:shadow-md transition-all ease-linear flex gap-2 items-center"
            >
              Crear nueva venta
              <BsFolderPlus className="text-2xl" />
            </Link>
          </div>
        </div>
      )}
      {ventas.length > 0 && (
        <div className="bg-white w-full flex justify-between items-center ">
          <div className="flex">
            <p className="bg-sky-100/80 px-8 text-[16px] py-4 text-sky-600 font-semibold">
              Ventas
            </p>
          </div>
          <div className="mx-5 z-[0] flex gap-2">
            <button className="text-sm font-semibold bg-green-500/90 py-2 px-5 rounded-2xl text-white group flex gap-3 items-center relative transition-all ease-linear duration-300 z-0">
              <Link
                to={"/crear-venta"}
                className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
              >
                Crear nueva venta
              </Link>
              <IoIosAddCircleOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
            </button>
          </div>
        </div>
      )}
      {ventas.length > 0 && (
        <div className="flex flex-col gap-5 mx-10">
          <section className="py-10 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl py-8 px-5 shadow-lg transition-all ease-linear flex justify-between items-center">
              <div>
                <IoIosAddCircleOutline className="text-7xl text-sky-700 bg-sky-100 rounded-full py-3 px-3.5" />
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="bg-sky-100 py-2 px-3 rounded-xl">
                  <p className="text-xs text-sky-700 font-bold">
                    Número total de ventas
                  </p>
                </div>
                <div>
                  <p className="font-normal">
                    Ventas registradas hasta el momento{" "}
                    <span className="font-bold text-sky-500 bg-sky-100 py-2 px-2 rounded-xl">
                      {ventas.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Aquí podrías agregar otras métricas relacionadas con ventas */}
          </section>
          <div className="bg-white rounded-3xl py-5 px-5 shadow-lg transition-all ease-linear flex gap-2 text-sm">
            <Link
              to={"/crear-venta"}
              className="bg-sky-100 py-3 px-6 rounded-full text-sky-700 group flex gap-3 items-center relative transition-all"
            >
              Crear nueva venta
            </Link>
          </div>
          <TableVentas ventas={ventas} /> {/* Cambia a la tabla de ventas */}
        </div>
      )}
    </div>
  );
}
