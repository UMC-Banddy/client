import { styled, Switch, type SwitchProps } from "@mui/material";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 91,
  height: 40,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 3.08, // 2 * (40/26) ≈ 3.08
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(51px)", // 16 * (91/42) * (40/26) ≈ 51px
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#D13D55",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "9.23px solid #fff", // 6 * (91/42) * (40/26) * 0.8 ≈ 9.23px (slightly reduced for better appearance)
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 26, // 22 * (91/42) * (40/26) * 0.85 ≈ 34px (slightly reduced for better appearance)
    height: 26, // Same as width to maintain aspect ratio
    transform: "translateY(4px)",
  },
  "& .MuiSwitch-track": {
    position: "relative",
    borderRadius: 20,
    backgroundColor: "#555",
    opacity: 1,

    // before = 모집완료, after = 모집중
    "&:before, &:after": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      fontFamily: "Wanted Sans",
      fontSize: 13,
      fontWeight: 600,
      color: "#fff",
      whiteSpace: "nowrap",
      transition: "opacity 300ms ease-in-out",
    },

    // OFF 상태 (초기)
    "&:before": {
      content: '"모집완료"',
      right: 10,
      opacity: 1,
    },
    "&:after": {
      content: '"모집중"',
      left: 14,
      opacity: 0,
    },
  },

  // 체크되면 순서대로 cross-fade
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track:before": {
    opacity: 0,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track:after": {
    opacity: 1,
  },
}));

export default IOSSwitch;
