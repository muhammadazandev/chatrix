import { create } from "zustand";
import { authApi } from "../utils/api";
import toast from "react-hot-toast";
import handleError from "../utils/handleError";
import { persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: "system",
      accentColor: "#1073ef",
      isAnimations: true,
      transition: "smooth",

      updateSetting: async (settingKey, settingValue) => {
        try {
          if (
            !settingKey ||
            settingValue === undefined ||
            settingValue === null
          )
            return;

          const res = await authApi.patch("/setting/update", {
            [settingKey]: settingValue,
          });

          const settings = res.data?.settings;

          if (settings) {
            set({
              theme: settings.theme,
              accentColor: settings.accentColor,
              isAnimations: settings.isAnimations,
              transition: settings.transition,
            });
          }
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        }
      },

      getSetting: async () => {
        try {
          const res = await authApi.get("/setting/get");

          const settings = res.data?.settings;

          if (settings) {
            set({
              theme: settings.theme,
              accentColor: settings.accentColor,
              isAnimations: settings.isAnimations,
              transition: settings.transition,
            });
          }
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        }
      },
    }),
    {
      name: "settings-storage",
    },
  ),
);

export default useSettingsStore;
