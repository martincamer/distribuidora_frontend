import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Label } from "../components/ui";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import { useProductos } from "../context/ProductosContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function CrearProductoNuevo() {
  const { createProducto } = useProductos();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      createProducto({
        ...data,
        date: dayjs.utc(data.date).format(),
      });

      navigate("/productos");
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
            className="bg-gray-100/50 px-8 text-sm py-4 text-gray-700 font-medium hover:bg-sky-100 transition-all"
          >
            Productos
          </Link>
          <Link
            to={"/categorias"}
            className="bg-sky-50 px-8 text-sm py-4 text-sky-600 font-medium hover:bg-gray-100 transition-all"
          >
            Crear producto
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
            <p className="text-sky-500 text-center text-base">
              Formulario crear nuevo producto
            </p>
          </div>
          <div className="px-10 py-8 flex flex-col gap-5">
            <div>
              <p className="text-sm text-sky-600">Crear un nuevo producto</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  El codigo
                </label>
                <input
                  {...register("codigo")}
                  type="text"
                  placeholder="Ej: Tkpr1"
                  className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">El</label>
                <input
                  {...register("codigo")}
                  type="text"
                  placeholder="Ej: Tkpr1"
                  className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-green-500 py-2 px-4 text-sm rounded-xl font-bold text-white mt-3 hover:bg-green-600/90"
                >
                  Guardar categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
