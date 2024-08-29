import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useVentas } from "../context/VentasContext";
import instance from "../api/axios";
import VentasAreaChart from "../components/charts/VentasAreaChart";
import ComprobantesLineChart from "../components/charts/ComprobantesLineChart";
import dayjs from "dayjs";

export function HomeApp() {
  const [comprobante, setComprobante] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  const { ventas, getVentas } = useVentas(); // Cambia a ventas y función para obtener ventas

  useEffect(() => {
    getVentas(); // Obtiene las ventas cuando el componente se monta
  }, []); // No olvides agregar dependencias necesarias para evitar advertencias

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Los meses son 0-based, por eso sumamos 1

  // Inicializar el estado con el año y mes actuales
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filteredComprobantes = comprobante.filter((c) => {
    const date = new Date(c.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based

    return (
      (selectedYear ? year === parseInt(selectedYear, 10) : true) &&
      (selectedMonth ? month === parseInt(selectedMonth, 10) : true)
    );
  });

  const filteredVentas = ventas.filter((c) => {
    const date = new Date(c.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based

    return (
      (selectedYear ? year === parseInt(selectedYear, 10) : true) &&
      (selectedMonth ? month === parseInt(selectedMonth, 10) : true)
    );
  });

  // Filtrar las ventas que son de tipo 'venta'
  const ventasDeTipoVenta = filteredVentas.filter(
    (venta) => venta.tipo === "venta"
  );

  // Calcular el total de ganancias para cada venta de tipo 'venta'
  const totalVentas = ventasDeTipoVenta.map((venta) => {
    return venta.productos.reduce((suma, producto) => {
      return suma + producto.total_dinero; // Sumar el total_dinero de cada producto
    }, 0);
  });

  // Calcular el total de ganancias para todas las ventas de tipo 'venta' combinadas
  const sumaTotalGanancias = totalVentas.reduce((suma, ganancia) => {
    return suma + ganancia;
  }, 0);

  const getComprobantesDelMesRequest = async () => {
    try {
      const response = await instance.get(`/clientes/comprobantes-mensuales`);

      // Llama a la función para actualizar el cliente en el backend

      console.log(response);

      return setComprobante(response.data); // Devuelve los comprobantes del mes actual
    } catch (error) {
      console.error("Error al obtener comprobantes del mes:", error);
      throw error; // Re-lanza el error para manejo posterior
    }
  };

  useEffect(() => {
    getComprobantesDelMesRequest();
  }, []);

  const totalGanancias = filteredComprobantes.reduce((total, c) => {
    return Number(total) + Number(c.total);
  }, 0);

  // console.log(comprobante);
  const totalPorCategoriaColor = filteredVentas.reduce((acumulador, venta) => {
    venta.productos.forEach((producto) => {
      const { categoria, color, total_dinero, total_kilogramos } = producto;

      if (!acumulador[categoria]) {
        acumulador[categoria] = {};
      }

      if (!acumulador[categoria][color]) {
        acumulador[categoria][color] = { total_dinero: 0, total_kilogramos: 0 };
      }

      acumulador[categoria][color].total_dinero += total_dinero;
      acumulador[categoria][color].total_kilogramos += total_kilogramos;
    });

    return acumulador;
  }, {});

  // Calcular el total general de dinero y kilogramos
  const totalGeneralDinero = Object.values(totalPorCategoriaColor)
    .flatMap((categoria) => Object.values(categoria))
    .reduce((total, value) => total + value.total_dinero, 0);

  const totalGeneralKg = Object.values(totalPorCategoriaColor)
    .flatMap((categoria) => Object.values(categoria))
    .reduce((total, value) => total + value.total_kilogramos, 0);

  return (
    <section className="mx-10 my-10 max-md:mx-4">
      <div className="flex gap-2 mb-4">
        <select
          className="outline-none border border-gray-300 py-2 px-2 rounded-md text-sm font-bold"
          onChange={handleYearChange}
          value={selectedYear}
        >
          <option className="font-bold" value="">
            Seleccione el año
          </option>
          {/* Generar opciones de años dinámicamente */}
          {Array.from(
            new Set(comprobante.map((c) => new Date(c.date).getFullYear()))
          ).map((year) => (
            <option className="font-semibold" key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Selector para mes */}
        <select
          className="outline-none border border-gray-300 py-2 px-2 rounded-md text-sm font-bold capitalize"
          onChange={handleMonthChange}
          value={selectedMonth}
        >
          <option className="font-bold" value="">
            Seleccione el mes
          </option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option
              className="font-semibold capitalize"
              key={month}
              value={month}
            >
              {new Date(0, month - 1).toLocaleString("es-ES", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        <div className="stats items-center scroll-bar max-md:scroll-hidden border border-gray-300">
          <div className="stat">
            <div className="stat-title font-semibold">
              Total ganancias generadas
            </div>
            <div className="stat-value text-green-500">
              {" "}
              {totalGanancias?.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2, // Mínimo dos decimales
                maximumFractionDigits: 2, // Máximo dos decimales
              })}
            </div>
            <div className="stat-desc font-bold text-green-500 mt-1">
              ↗︎ {Number(totalGanancias & 100).toFixed(2)}%
            </div>
          </div>

          <div>
            <div className="py-5 px-5 w-32 font-bold mx-auto">
              <CircularProgressbar
                value={Number(totalGanancias) & 100}
                text={`${Number(totalGanancias & 100)}%`}
                strokeWidth={9}
                // backgroundPadding={"#22c55e"}
                styles={buildStyles({
                  textColor: "rgb(34 197 94)",
                  pathColor: "rgb(34 197 94)",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>
        </div>

        <div className="stats items-center scroll-bar max-md:scroll-hidden border border-gray-300">
          <div className="stat">
            <div className="stat-title font-semibold">
              Total generado en ventas
            </div>
            <div className="stat-value text-blue-500">
              {" "}
              {sumaTotalGanancias?.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2, // Mínimo dos decimales
                maximumFractionDigits: 2, // Máximo dos decimales
              })}
            </div>
            <div className="stat-desc font-bold text-blue-500 mt-1">
              ↗︎ {Number(sumaTotalGanancias & 100).toFixed(2)}%
            </div>
          </div>

          <div>
            <div className="py-5 px-5 w-32 font-bold mx-auto">
              <CircularProgressbar
                value={Number(sumaTotalGanancias) & 100}
                text={`${Number(sumaTotalGanancias & 100)}%`}
                strokeWidth={9}
                // backgroundPadding={"#22c55e"}
                styles={buildStyles({
                  textColor: "#3b82f6",
                  pathColor: "#3b82f6",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>
        </div>

        <div className="stats items-center scroll-bar max-md:scroll-hidden border border-gray-300">
          <div className="stat">
            <div className="stat-title font-semibold">Total ventas</div>
            <div className="stat-value text-primary">
              {" "}
              {filteredVentas.length}
            </div>
            <div className="stat-desc font-bold text-primarymt-1">
              ↗︎ {Number(filteredVentas.length & 100).toFixed(2)}%
            </div>
          </div>

          <div>
            <div className="py-5 px-5 w-32 font-bold mx-auto">
              <CircularProgressbar
                value={Number(filtrados.length) & 100}
                text={`${Number(filtrados.length & 100)}%`}
                strokeWidth={9}
                // backgroundPadding={"#22c55e"}
                styles={buildStyles({
                  textColor: "rgb(249 115 22)",
                  pathColor: "rgb(249 115 22)",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12  grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <div className="bg-white py-5 px-5 rounded-md border-gray-300 border">
          <p className=" text-gray-800 px-5 font-bold">
            Ventas generadas grafico.
          </p>
          <VentasAreaChart ventas={filteredVentas} />
        </div>
        <div className="bg-white py-5 px-5 rounded-md border-gray-300 border">
          <p className=" text-gray-800 px-5 font-bold">
            Ganancias generadas grafico.
          </p>
          <ComprobantesLineChart datos={filteredComprobantes} />
        </div>
      </div>

      <div className="bg-white py-5 px-5 rounded-xl mt-10">
        <div>
          <div className="text-gray-800 font-semibold text-sm mb-2 pb-2 mt-4">
            PROGRESO EN VENTAS/GANANCIAS POR CATEGORIA
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {Object.entries(totalPorCategoriaColor).map(
              ([categoria, colores]) => (
                <div
                  className="flex flex-col gap-1 border-gray-300 border py-3 px-5 rounded-md cursor-pointer transition-all"
                  key={categoria}
                >
                  <h3 className="uppercase underline font-bold">{categoria}</h3>
                  {Object.entries(colores).map(([color, value]) => {
                    const { total_dinero, total_kilogramos } = value;

                    const porcentajeDinero =
                      (total_dinero / totalGeneralDinero) * 10.0;

                    const porcentajeKg =
                      (total_kilogramos / totalGeneralKg) * 15.0;

                    return (
                      <div key={color}>
                        <p className="uppercase font-semibold text-gray-800">
                          {color}{" "}
                          <span className="font-bold text-blue-500">
                            {total_dinero.toLocaleString("es-ar", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </span>{" "}
                          |{" "}
                          <span className="text-green-400">
                            {total_kilogramos.toFixed(2)} kg
                          </span>
                        </p>
                        {/* Progreso por Dinero */}
                        <progress
                          className="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg rounded-full [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-400 w-full"
                          value={porcentajeDinero}
                          max="100"
                        >
                          {porcentajeDinero.toFixed(2)}%
                        </progress>
                        {/* Progreso por Kilogramos */}
                        <progress
                          className="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg rounded-full [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-emerald-400 w-full"
                          value={porcentajeKg}
                          max="100"
                        >
                          {porcentajeKg.toFixed(2)}%
                        </progress>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
