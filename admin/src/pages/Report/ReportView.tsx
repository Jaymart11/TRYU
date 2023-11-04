import { Button } from "@mui/material";
import { downloadReports } from "../../shared/service/reportService";

const ReportView = () => {
  const test = () => {
    try {
      // Create a blob URL for the response data
      downloadReports().then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));

        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exported-data.xlsx");
        document.body.appendChild(link);

        // Trigger the download and remove the temporary element
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };
  return <Button onClick={test}>Test</Button>;
};

export default ReportView;
