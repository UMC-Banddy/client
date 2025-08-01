interface StatusIndicatorProps {
  status: "black" | "red";
  src: string;
}

const StatusIndicator = ({ status = "black", src }: StatusIndicatorProps) => {
  return (
    <div
      className="flex justify-center items-center size-[40px] rounded-full"
      style={{ backgroundColor: status === "black" ? "#292929" : "#B42127" }}
    >
      <img src={src} alt="" className="scale-[1.2]" />
    </div>
  );
};

export default StatusIndicator;
