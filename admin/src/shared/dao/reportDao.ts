import { useQuery } from "react-query";
import { downloadReports } from "../service/reportService";

export const useDownloadExport = () => {
  return useQuery("export_report", downloadReports);
};
