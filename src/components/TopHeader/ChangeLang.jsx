import { useState } from "react";
import { CircularProgress, Select, MenuItem, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useLang } from "../../context/LangContext.jsx";

function ChangeLang() {
  const { lang, changeLanguage } = useLang();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(lang || "en");
  const [loading, setLoading] = useState(false);

  const styles = {
    display: loading ? "none" : "block",
    color: "#374151",
    backgroundColor: "transparent",
    minWidth: "110px",
    "& .MuiSelect-select": {
      color: "#374151",
      paddingRight: "24px",
    },
    "& .MuiSvgIcon-root": {
      color: "#374151",
    },
    "@media (max-width: 768px)": {
      fontSize: "12px",
      minWidth: "90px",
    },
  };

  const langChange = (e) => {
    const selectedLang = e.target.value;
    setSnackbarOpen(true);
    setLoading(true);
    changeLanguage(selectedLang);
    setSelectedLanguage(selectedLang);

    setTimeout(() => {
      window.location.reload();
      setLoading(false);
    }, 500);
  };

  const handleMassage = () => {
    if (selectedLanguage === "en") {
      return "Страница будет перезагружена, язык установлен на English.";
    } else if (selectedLanguage === "ru") {
      return "Страница будет перезагружена, язык установлен на русский.";
    }
  };

  return (
    <div>
      <Select
        sx={styles}
        value={lang}
        onChange={langChange}
        disabled={loading} // Disable select while loading
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ru">Русский</MenuItem>
      </Select>
      {loading && (
        <>
          <CircularProgress
            sx={{
              color: "white",
              width: "30px !important",
              height: "30px !important",
              my: "10px !important",
            }}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={1000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert severity={"success"} sx={{ width: "100%" }}>
              {handleMassage()}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default ChangeLang;
