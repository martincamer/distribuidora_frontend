import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVentas } from "../context/VentasContext";
import { formatearDinero } from "../helpers/FormatearDinero";
import { PDFViewer } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { PresupuestoDocument } from "../components/pdfs/PresupuestoDocument";
import dayjs from "dayjs"; // Para formatear fechas

export function Venta() {
  const { getVenta } = useVentas(); // Función para obtener un cliente

  const [venta, setVenta] = useState({}); // Estado para almacenar el cliente

  const params = useParams(); // Para obtener el ID del cliente desde la URL

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getVenta(params.id); // Obtiene el cliente por ID
        setVenta(res); // Establece el estado del cliente
      } catch (error) {
        console.error("Error al cargar el cliente:", error); // Manejo de errores
      }
    };

    loadData(); // Carga los datos del cliente cuando el componente se monta
  }, [params.id, getVenta]); // Asegúrate de incluir las dependencias necesarias

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY"); // Formato de fecha
  };

  // Formatear el total como moneda argentina

  const totalVenta = venta?.productos?.reduce(
    (total, producto) => total + producto.total_dinero,
    0
  );

  const totalKIlogramos = venta?.productos?.reduce(
    (total, producto) => total + producto.total_kilogramos,
    0
  );

  const totalPerfiles = venta?.productos?.reduce(
    (total, producto) => total + Number(producto.cantidad),
    0
  );

  // Objeto para agrupar por categoria y color
  const groupedByCategoryAndColor = {};

  // Agrupar productos por categoria y color
  venta?.productos?.forEach((producto) => {
    const key = `${producto.categoria}-${producto.color}`; // Clave para agrupar

    if (!groupedByCategoryAndColor[key]) {
      // Si la clave no existe, crear una nueva entrada
      groupedByCategoryAndColor[key] = {
        categoria: producto.categoria,
        color: producto.color,
        precio: producto.precio,
        total_dinero: 0,
        total_kilogramos: 0,
      };
    }

    // Sumar los valores al grupo existente
    groupedByCategoryAndColor[key].total_dinero += producto.total_dinero;
    groupedByCategoryAndColor[key].total_kilogramos +=
      producto.total_kilogramos;
  });

  // Convertir el objeto a un arreglo
  const groupedProducts = Object.values(groupedByCategoryAndColor);

  console.log(groupedProducts);

  return (
    <div className="pb-12">
      <div className="bg-gray-100 py-14 px-14 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 text-xl">
            Datos{" "}
            {(venta.tipo === "venta" && "de la venta realizada") ||
              (venta.tipo === "presupuesto" &&
                "del presupuesto realizado")}{" "}
            <span className="text-primary capitalize font-bold">
              {venta?.cliente?.nombre} {venta?.cliente?.apellido}
            </span>
          </p>
          <p className="text-gray-800 font-normal text-sm">
            Aquí puedes ver información detallada del cliente{" "}
            {(venta.tipo === "venta" && "de la venta") ||
              (venta.tipo === "presupuesto" && "del presupuesto")}{" "}
          </p>
        </div>
        <div>
          <button
            onClick={() =>
              document.getElementById("my_modal_venta_presupuesto").showModal()
            }
            className="bg-primary text-white font-bold text-sm py-1.5 px-4 rounded-md hover:bg-gray-800 transition-all flex gap-2 items-center"
          >
            Descargar factura de la venta o presupuesto{" "}
            <FaFilePdf className="text-xl" />
          </button>
        </div>
      </div>

      <div className="mx-10 py-10">
        <div className="flex gap-10 mt-10">
          <div className=" rounded-md w-4/5">
            <div className="py-10 px-10 bg-gray-800 rounded-t-xl flex justify-between">
              <div className="flex flex-col gap-5">
                <p className="text-white">
                  Fecha de creación{" "}
                  <span className="text-primary font-bold">
                    {formatDate(venta.date)} {/* Fecha de creación */}
                  </span>
                </p>
                <p className="text-white">
                  Nombre completo{" "}
                  <span className="text-primary font-bold capitalize">
                    {venta?.cliente?.nombre} {venta?.cliente?.apellido}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-white">
                  Localidad{" "}
                  <span className="text-primary font-bold capitalize">
                    {venta?.cliente?.localidad}
                  </span>
                </p>
                <p className="text-white">
                  Provincia{" "}
                  <span className="text-primary font-bold capitalize">
                    {venta?.cliente?.provincia}
                  </span>
                </p>
              </div>
            </div>
            <div className="py-5 px-5 bg-primary text-white text-center font-semibold">
              Información del cliente
            </div>
            <div className="py-10 px-10 bg-gray-100 grid grid-cols-2 gap-6">
              <p className="font-bold flex flex-col">
                DNI{" "}
                <span className="text-gray-400 font-normal">
                  {venta?.cliente?.dni}
                </span>
              </p>
              <p className="font-bold flex flex-col">
                Teléfono{" "}
                <span className="text-gray-400 font-normal">
                  {venta?.cliente?.telefono}
                </span>
              </p>
              <p className="font-bold flex flex-col">
                Email{" "}
                <span className="text-gray-400 font-normal">
                  {venta?.cliente?.email}
                </span>
              </p>
            </div>

            <div className="py-10 px-10 bg-gray-100 rounded-b-md">
              <div className="flex justify-end gap-6 my-4">
                <div className="bg-primary text-white font-semibold text-base px-6 py-3 rounded-md transition-all flex items-center gap-2 hover:bg-primary/90 cursor-pointer">
                  {formatearDinero(totalVenta)}
                </div>
              </div>
            </div>
          </div>
          <div class="w-full mx-auto">
            <div class="grid grid-cols-3 gap-4">
              <div
                id="jh-stats-positive"
                class="flex flex-col justify-center px-4 py-6 bg-white border rounded-md"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-green-500 text-md">
                      <span class="font-bold">
                        {Number(totalVenta % 100).toFixed(2)}%
                      </span>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {formatearDinero(totalVenta)}
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total{" "}
                    {(venta.tipo === "venta" && "de la venta") ||
                      (venta.tipo === "presupuesto" && "del presupuesto")}{" "}
                  </p>
                </div>
              </div>

              <div
                id="jh-stats-negative"
                class="flex flex-col justify-center px-4 py-6 bg-white border rounded-md"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-gray-500 text-md">
                      <span class="font-bold">
                        {Number(totalKIlogramos % 100).toFixed(2)}%
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {totalKIlogramos?.toFixed(2)} Kgs
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total de kgs
                  </p>
                </div>
              </div>

              <div
                id="jh-stats-neutral"
                class="flex flex-col justify-center px-4 py-6 bg-white border rounded-md"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-gray-500 text-md">
                      <span class="font-bold">
                        {Number(totalPerfiles % 100).toFixed(2)} %
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {totalPerfiles}
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total perfiles
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white py-6 px-6 rounded-xl mt-5 h-auto w-auto">
              <p>
                <p className="font-bold text-gray-800 text-xl">Estadisticas</p>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {groupedProducts.map((p) => (
                  <div className="mt-3 border border-gray-300 py-3 px-4 rounded-md">
                    <p className="font-bold text-gray-700 uppercase text-sm">
                      Categoria{" "}
                      <span className="text-gray-80 font-semibold text-sm">
                        {p.categoria}
                      </span>
                    </p>
                    <p className="font-bold text-gray-700 uppercase text-sm">
                      Color{" "}
                      <span className="text-gray-80 font-semibold text-sm">
                        {p.color}
                      </span>
                    </p>
                    <p className="font-bold text-gray-700 uppercase text-sm">
                      Precio del kg{" "}
                      <span className="text-gray-80 font-semibold text-sm">
                        {formatearDinero(p.precio)}
                      </span>
                    </p>
                    <p className="font-bold text-gray-700 uppercase text-sm">
                      Total dinero{" "}
                      <span className="text-gray-80 font-semibold text-sm">
                        {formatearDinero(p.total_dinero)}
                      </span>
                    </p>
                    <p className="font-bold text-gray-700 uppercase text-sm">
                      Total Kilogramos{" "}
                      <span className="text-gray-80 font-semibold text-sm">
                        {p?.total_kilogramos?.toFixed(2)} kgs
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between mx-10">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-700 text-xl">
            Perfiles vendidos en la{" "}
            <span className="capitalize text-primary">{venta.tipo}</span>{" "}
          </p>
          <p className="text-gray-600 font-normal text-sm">
            Aquí puedes ver información de los perfiles{" "}
            {(venta.tipo === "venta" && "vendidos") ||
              (venta.tipo === "presupuesto" && "del presupuesto")}
          </p>
        </div>
      </div>

      <div className="px-10 pt-2 pb-10 rounded-xl">
        <table className="table">
          <thead className="font-bold text-gray-800 text-sm">
            <tr>
              <th>Codigo</th>
              <th>Descripción</th>
              <th>Color</th>
              <th>Categoria</th>
              <th>Kgs</th>
              <th>Precio Kg</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody className="uppercase text-xs font-medium">
            {venta?.productos?.map((p) => (
              <tr key={p.id}>
                <th>{p.codigo}</th>
                <td>{p.detalle}</td>
                <td>{p.color}</td>
                <td>{p.categoria}</td>
                <td>{Number(p.total_kilogramos).toFixed(2)} kgs</td>
                <th>{formatearDinero(Number(p.precio))}</th>
                <td>{Number(p.cantidad)} brs</td>
                <th>{formatearDinero(Number(p.total_dinero))}</th>
                <td>
                  <img className="w-[65px]" src={p.imagen} alt="img" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {venta.tipo === "venta" ? (
        <div className="mx-10 flex">
          <Link
            to={`/factura/${params.id}`}
            className="bg-blue-500 py-2 px-6 rounded-md text-sm text-white font-semibold flex gap-2 items-center"
          >
            Emitir venta documento <FaFilePdf className="text-xl" />
          </Link>
        </div>
      ) : (
        <div className="mx-10 flex">
          <Link
            to={`/factura/${params.id}`}
            className="bg-blue-500 py-2 px-6 rounded-md text-sm text-white font-semibold flex gap-2 items-center"
          >
            Emitir presupuesto documento <FaFilePdf className="text-xl" />
          </Link>
        </div>
      )}

      <ModalFacturaVentaPresupuesto venta={venta} />
    </div>
  );
}

const ModalFacturaVentaPresupuesto = ({ venta }) => {
  const { user } = useAuth();
  return (
    <dialog id="my_modal_venta_presupuesto" className="modal">
      <div className="modal-box max-w-full rounded-md h-full scroll-bar cursor-pointer">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-5">
          Descargar o imprimir la factura de la venta o presupuesto.
        </h3>
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <PresupuestoDocument user={user} datos={venta} />
        </PDFViewer>
      </div>
    </dialog>
  );
};
