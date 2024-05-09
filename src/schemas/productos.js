import { z } from "zod";

export const productoSchema = z.object({
  codigo: z.string().nonempty({ message: "El código es requerido" }),
  detalle: z.string().nonempty({ message: "El detalle es requerido" }),
  color: z.string().nonempty({ message: "El color es requerido" }),
  categoria: z.string().nonempty({ message: "La categoría es requerida" }),
  kg_barra_estimado: z
    .string()
    .nonempty({ message: "El peso de la barra es requerido" }),
});
