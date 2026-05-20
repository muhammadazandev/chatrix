import { useEffect } from "react";
import useSettingsStore from "../store/useSettingsStore";


const AppearanceBootstrap = () => {
  const theme = useSettingsStore((state) => state.theme);
  const accentColor = useSettingsStore((state) => state.accentColor);
  const getSetting = useSettingsStore((state) => state.getSetting);

  useEffect(() => {
    getSetting();
  }, []);

  useEffect(() => {
    const mediaTheme = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const activeTheme =
        theme === "system" ? (mediaTheme.matches ? "dark" : "light") : theme;

      document.documentElement.dataset.theme = activeTheme;
    };

    updateTheme();

    mediaTheme.addEventListener("change", updateTheme);
    return () => mediaTheme.removeEventListener("change", updateTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent-color-primary",
      accentColor,
    );
  }, [accentColor]);

  return null;
};

export default AppearanceBootstrap;
