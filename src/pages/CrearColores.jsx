import { useProductos } from "../context/ProductosContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColores } from "../components/colores/TableColores";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function CrearColores() {
  const { createColor } = useProductos();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //submit crear
  const onSubmit = async (data) => {
    try {
      createColor({
        ...data,
        date: dayjs.utc(data.date).format(),
      });

      reset();
      closeModal();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="bg-white w-full flex justify-between items-center ">
        <div className="flex">
          <Link
            to={"/productos"}
            className="px-8 text-[16px] py-4 text-gray-700 font-medium hover:bg-sky-200 hover:text-sky-900 transition-all"
          >
            Productos
          </Link>
          <Link
            to={"/colores"}
            className="bg-sky-100 px-8 text-[16px] py-4 text-sky-700 font-medium hover:bg-gray-100 transition-all"
          >
            Colores
          </Link>
        </div>
        <div className="flex mx-9">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl cursor-pointer"
                  to={"/home"}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="bg-sky-100 text-sky-700 py-2 px-4 rounded-xl cursor-pointer"
                  to={"/productos"}
                >
                  Productos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-10 w-1/2 flex flex-col gap-2">
        <div className="bg-white my-5 rounded-xl shadow-lg flex flex-col gap-3">
          <div className="bg-gray-100 py-4 rounded-t-xl">
            <p className="text-sky-500 text-center text-base">Formulario</p>
          </div>
          <div className="px-10 py-8 flex flex-col gap-5">
            <div>
              <p className="text-sm text-sky-600">Crear nuevo color</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  El nombre del color
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Ej: blanco aluar"
                  className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-green-500/90 py-2.5 px-6 text-sm rounded-full font-semibold text-white mt-3 hover:bg-green-500"
                >
                  Guardar el color
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-10 w-2/3">
        <TableColores />
      </div>{" "}
    </section>
  );
}
