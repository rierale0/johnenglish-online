import { useState } from "react";
import { BarChart3, BookOpen, Calendar, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatLocalDate } from "@/lib/formatLocalDate";

type RowData = {
  date: string;
  title: string;
  status: "Completado" | "Programado" | "Pendiente" | string;
  level: string;
  link: string;
};

interface NotionTableProps {
  data: RowData[];
}

export default function NotionTable({ data }: NotionTableProps) {
  // Separa por estado
  const completed = data.filter(i => i.status === "Completado").sort((a, b) => b.date.localeCompare(a.date));
  const scheduled = data.filter(i => i.status === "Programado").sort((a, b) => a.date.localeCompare(b.date));

  // Control de paginación
  const [completedCount, setCompletedCount] = useState(10);
  const [scheduledCount, setScheduledCount] = useState(10);

  // Sublistas a mostrar
  const completedToShow = completed.slice(0, completedCount);
  const scheduledToShow = scheduled.slice(0, scheduledCount);

  return (
    <div className="max-w-4xl sm:mx-auto md:mx-0 w-full">
      {/* Escritorio */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha</span>
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Título</span>
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Estado</span>
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Nivel</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* ---- Completados ---- */}
            {completedToShow.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="bg-green-50 font-bold px-4 py-2 text-green-900">Clases Completadas</td>
                </tr>
                {completedToShow.map((item, idx) => (
                  <tr
                    key={"c" + idx}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    <td className="px-4 py-2 text-gray-700">{formatLocalDate(item.date)}</td>
                    <td className="px-4 py-2 text-gray-700">{item.title}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{item.level || "—"}</td>
                  </tr>
                ))}
                {completed.length > completedCount && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center">
                      <button
                        className="flex items-center gap-2 mx-auto text-green-700 hover:underline"
                        onClick={() => setCompletedCount(c => c + 10)}
                      >
                        <ChevronDown className="h-4 w-4" />
                        {`Ver ${Math.min(10, completed.length - completedCount)} más completadas`}
                      </button>
                    </td>
                  </tr>
                )}
                {completedCount > 10 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center">
                      <button
                        className="flex items-center gap-2 mx-auto text-green-700 hover:underline"
                        onClick={() => setCompletedCount(10)}
                      >
                        <ChevronUp className="h-4 w-4" />
                        {"Ver menos completadas"}
                      </button>
                    </td>
                  </tr>
                )}
              </>
            )}
            {/* ---- Programadas ---- */}
            {scheduledToShow.length > 0 && (
              <>
                <tr>
                  <td colSpan={4} className="bg-blue-50 font-bold px-4 py-2 text-blue-900">Clases Programadas</td>
                </tr>
                {scheduledToShow.map((item, idx) => (
                  <tr
                    key={"s" + idx}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    <td className="px-4 py-2 text-gray-700">{formatLocalDate(item.date)}</td>
                    <td className="px-4 py-2 text-gray-700">{item.title}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{item.level || "—"}</td>
                  </tr>
                ))}
                {scheduled.length > scheduledCount && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center">
                      <button
                        className="flex items-center gap-2 mx-auto text-blue-700 hover:underline"
                        onClick={() => setScheduledCount(c => c + 10)}
                      >
                        <ChevronDown className="h-4 w-4" />
                        {`Ver ${Math.min(10, scheduled.length - scheduledCount)} más programadas`}
                      </button>
                    </td>
                  </tr>
                )}
                {scheduledCount > 10 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center">
                      <button
                        className="flex items-center gap-2 mx-auto text-blue-700 hover:underline"
                        onClick={() => setScheduledCount(10)}
                      >
                        <ChevronUp className="h-4 w-4" />
                        {"Ver menos programadas"}
                      </button>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Cards versión móvil ---- */}
      <div className="md:hidden flex flex-col gap-4 mt-4">
        {/* Completadas */}
        {completedToShow.length > 0 && (
          <>
            <div className="bg-green-50 font-bold text-green-900 rounded-lg p-2 mb-1">Clases Completadas</div>
            {completedToShow.map((item, idx) => (
              <a
                key={"cm" + idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:bg-gray-50 transition"
              >
                <p className="text-xs text-gray-500 mb-1">📅 {formatLocalDate(item.date)}</p>
                <p className="text-sm font-semibold text-gray-700 mb-2">📌 {item.title}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                    {item.status}
                  </span>
                  <span className="text-gray-700">🧠 {item.level || "—"}</span>
                </div>
              </a>
            ))}
            {completed.length > completedCount && (
              <button
                className="flex items-center gap-2 mx-auto text-green-700 hover:underline"
                onClick={() => setCompletedCount(c => c + 10)}
              >
                <ChevronDown className="h-4 w-4" />
                {`Ver ${Math.min(10, completed.length - completedCount)} más completadas`}
              </button>
            )}
            {completedCount > 10 && (
              <button
                className="flex items-center gap-2 mx-auto text-green-700 hover:underline"
                onClick={() => setCompletedCount(10)}
              >
                <ChevronUp className="h-4 w-4" />
                {"Ver menos completadas"}
              </button>
            )}
          </>
        )}

        {/* Programadas */}
        {scheduledToShow.length > 0 && (
          <>
            <div className="bg-blue-50 font-bold text-blue-900 rounded-lg p-2 mt-2 mb-1">Clases Programadas</div>
            {scheduledToShow.map((item, idx) => (
              <a
                key={"sm" + idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:bg-gray-50 transition"
              >
                <p className="text-xs text-gray-500 mb-1">📅 {formatLocalDate(item.date)}</p>
                <p className="text-sm font-semibold text-gray-700 mb-2">📌 {item.title}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                    {item.status}
                  </span>
                  <span className="text-gray-700">🧠 {item.level || "—"}</span>
                </div>
              </a>
            ))}
            {scheduled.length > scheduledCount && (
              <button
                className="flex items-center gap-2 mx-auto text-blue-700 hover:underline"
                onClick={() => setScheduledCount(c => c + 10)}
              >
                <ChevronDown className="h-4 w-4" />
                {`Ver ${Math.min(10, scheduled.length - scheduledCount)} más programadas`}
              </button>
            )}
            {scheduledCount > 10 && (
              <button
                className="flex items-center gap-2 mx-auto text-blue-700 hover:underline"
                onClick={() => setScheduledCount(10)}
              >
                <ChevronUp className="h-4 w-4" />
                {"Ver menos programadas"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
