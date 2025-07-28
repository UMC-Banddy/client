import { proxy } from "valtio";
import { type SettingItem } from "@/types/setting";
import alarmIcon from "@/assets/icons/setting/alarm.svg";
import noteIcon from "@/assets/icons/setting/note.svg";
import ghostIcon from "@/assets/icons/setting/ghost.svg";
import exitIcon from "@/assets/icons/setting/exit.svg";

interface SettingsState {
  settingsItems: SettingItem[];
  isLoading: boolean;
  error: string | null;
}

export const settingsStore = proxy<SettingsState>({
  settingsItems: [],
  isLoading: false,
  error: null,
});

// Actions
export const settingsActions = {
  setSettingsItems: (onWithdrawalClick: () => void) => {
    settingsStore.settingsItems = [
      {
        icon: alarmIcon,
        title: "알림 설정",
        onClick: () => console.log("알림 설정 클릭")
      },
      {
        icon: noteIcon,
        title: "이용약관 및 처리방침",
        onClick: () => console.log("이용약관 클릭")
      },
      {
        icon: ghostIcon,
        title: "밴디 식구들",
        onClick: () => console.log("밴디 식구들 클릭")
      },
      {
        icon: exitIcon,
        title: "회원 탈퇴",
        onClick: onWithdrawalClick
      }
    ];
  },

  setLoading: (isLoading: boolean) => {
    settingsStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    settingsStore.error = error;
  },

  clearSettings: () => {
    settingsStore.settingsItems = [];
    settingsStore.error = null;
  },
}; 