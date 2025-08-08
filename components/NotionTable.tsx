// Test comment to check for automatic reversion
"use client";

import { useState, ReactNode } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  Video,
  PlayIcon,
} from "lucide-react";
import { formatLocalDate } from "@/lib/formatLocalDate";

type RowData = {
  page_id: string;
  datetime: string;
  class_title: string;
  status: "completed" | "scheduled" | "pending" | "unassigned" | string | null | undefined;
  course: string;
  recording: string | null;
  icon: string | null;
};

interface NotionTableProps {
  data: RowData[];
}

interface ClassTableProps {
  title: string;
  data: RowData[];
  icon: ReactNode;
  theme: "blue" | "green";
  initialCount?: number;
}

// --- Helper para el badge de estado ---
const StatusBadge = ({ status }: { status: RowData["status"], theme: "blue" | "green" }) => {
  const baseClasses = "inline-block rounded-full px-2.5 py-1 text-xs font-semibold";
  let colorClasses = "";

  const normalizedStatus = (status || "").toLowerCase();

  switch (normalizedStatus) {
    case "completed":
      colorClasses = "bg-green-500/20 text-green-300";
      break;
    case "scheduled":
      colorClasses = "bg-blue-500/20 text-blue-300";
      break;
    case "unassigned":
    case "": // Handle empty string as unassigned
    case undefined: // Handle undefined as unassigned
      colorClasses = "bg-yellow-500/20 text-yellow-300";
      break;
    default:
      colorClasses = "bg-gray-500/20 text-gray-300";
  }
  
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// --- Componente Reutilizable para una Tabla de Clases ---
const ClassTable = ({ title, data, icon, theme, initialCount = 3 }: ClassTableProps) => {
  const [count, setCount] = useState(initialCount);
  const itemsToShow = data.slice(0, count);

  const headerColor = theme === "green" ? "text-green-300" : "text-blue-300";
  const headerBg = theme === "green" ? "bg-green-900/30" : "bg-blue-900/30";
  const buttonHoverBg = theme === "green" ? "hover:bg-green-400/80" : "hover:bg-blue-400/80";
  const buttonBg = theme === "green" ? "bg-green-500/80" : "bg-blue-500/80";

  const handleRowClick = (pageId: string) => {
    const notionPageId = pageId.replace(/-/g, "");
    window.open(`https://www.notion.so/${notionPageId}`, "_blank");
  };

  const renderShowMoreButton = () => {
    if (data.length > count) {
      return (
        <button
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-medium shadow-sm"
          onClick={() => setCount(count + 5)}
        >
          <ChevronDown className="h-4 w-4" />
          Ver más
        </button>
      );
    }
    return null;
  };

  const renderShowLessButton = () => {
    if (count > initialCount) {
      return (
        <button
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-medium shadow-sm"
          onClick={() => setCount(initialCount)}
        >
          <ChevronUp className="h-4 w-4" />
          Ver menos
        </button>
      );
    }
    return null;
  };

  return (
    <section>
      {/* ---- Título para Móvil ---- */}
      <h3 className={`md:hidden font-bold ${headerColor} text-lg mb-3 flex items-center gap-2`}>
        {icon}
        {title}
      </h3>

      {/* ---- Tabla de Escritorio ---- */}
      <div className="hidden md:block overflow-x-auto rounded-xl bg-[#343154] border border-white/10 shadow-lg">
        <table className="min-w-full text-sm table-fixed">
          <thead className="text-white/60 text-left">
            <tr>
              <td colSpan={5} className={`${headerBg} font-bold px-4 py-2 ${headerColor}`}>
                <div className="flex items-center gap-2">{icon} {title}</div>
              </td>
            </tr>
            <tr className="bg-white/5">
              <th className="px-4 py-3 font-medium w-[25%]">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Fecha</span></div>
              </th>
              <th className="px-4 py-3 font-medium w-[15%]">
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>Título</span></div>
              </th>
              <th className="px-4 py-3 font-medium w-[15%]">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /><span>Estado</span></div>
              </th>
              <th className="px-4 py-3 font-medium w-[15%]">
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span>Curso</span></div>
              </th>
              <th className="px-4 py-3 font-medium w-[15%]">
                <div className="flex items-center gap-2"><Video className="w-4 h-4" /><span>Grabación</span></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {itemsToShow.map((item) => (
              <tr key={item.page_id} className="group hover:bg-white/5 transition-colors duration-200 cursor-pointer" onClick={() => handleRowClick(item.page_id)}>
                <td className="px-4 py-3 text-white/80">{formatLocalDate(item.datetime)}</td>
                <td className="px-4 py-3 text-white/90 flex items-center gap-2">
                  {item.icon && <span className="text-lg leading-none">{item.icon}</span>}
                  {item.class_title}
                  <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white/80" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status || ""} theme={theme} />
                </td>
                <td className="px-4 py-3 text-white/80">{item.course || "—"}</td>
                <td className="px-4 py-3 text-white/80">
                  {item.recording ? (
                    <a
                      href={item.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${buttonBg} text-white ${buttonHoverBg} text-xs font-semibold`}
                    >
                      <PlayIcon className="w-3.5 h-3.5" />
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 flex justify-center">
          <div className="inline-flex items-center gap-1">
            {renderShowMoreButton()}
            {renderShowLessButton()}
          </div>
        </div>
      </div>

      {/* ---- Tarjetas para Móvil ---- */}
      <div className="md:hidden flex flex-col gap-3">
        {itemsToShow.map((item) => (
          <div
            key={item.page_id}
            onClick={() => handleRowClick(item.page_id)}
            className="block rounded-xl p-4 bg-[#343154] border border-white/10 shadow-md cursor-pointer"
          >
            <p className="text-sm font-semibold text-white/95 mb-2 flex items-center gap-2">
              {item.icon && <span className="text-lg leading-none">{item.icon}</span>}
              {item.class_title}
              <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white/80" />
            </p>
            <div className="flex justify-between items-center text-xs mb-2">
              <StatusBadge status={item.status || ""} theme={theme} />
              <span className="text-white/60 font-medium">{item.course || "—"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              {item.recording ? (
                    <a
                      href={item.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${buttonBg} text-white ${buttonHoverBg} text-xs font-semibold`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver grabación
                    </a>
                  ) : (null)}
            </div>
            <p className="text-xs text-white/50 mt-3">{formatLocalDate(item.datetime)}</p>
          </div>
        ))}
        <div className="mt-2 flex justify-center">
          <div className="inline-flex items-center gap-1">
            {renderShowMoreButton()}
            {renderShowLessButton()}
          </div>
        </div>
      </div>
    </section>
  );
};


// --- Componente Principal ---
export default function NotionTable({ data }: NotionTableProps) {
  const completed = data
    .filter((i) => (i.status || "").toLowerCase() === "completed")
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  const scheduled = data
    .filter((i) => {
      const normalizedStatus = (i.status || "").toLowerCase();
      return normalizedStatus === "scheduled" || normalizedStatus === "unassigned" || normalizedStatus === "";
    })
    .sort((a, b) => {
      const normalizedStatusA = (a.status || "").toLowerCase();
      const normalizedStatusB = (b.status || "").toLowerCase();

      // Priorizar clases agendadas sobre no asignadas o vacías
      if ((normalizedStatusA === "unassigned" || normalizedStatusA === "") && normalizedStatusB !== "unassigned" && normalizedStatusB !== "") return 1;
      if ((normalizedStatusB === "unassigned" || normalizedStatusB === "") && normalizedStatusA !== "unassigned" && normalizedStatusA !== "") return -1;
      
      // Luego ordenar por fecha
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
    });

  return (
    <div className="w-full flex flex-col gap-8">
      <ClassTable
        title="Clases Programadas"
        data={scheduled}
        icon={<Calendar className="h-5 w-5" />}
        theme="blue"
      />
      <ClassTable
        title="Clases Completadas"
        data={completed}
        icon={<CheckCircle className="h-5 w-5" />}
        theme="green"
      />
    </div>
  );
}
