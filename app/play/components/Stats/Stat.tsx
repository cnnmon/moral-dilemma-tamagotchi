export default function Stat({
  label,
  value, // out of 100
  dangerous,
  barStyle = { width: "100px" },
  containerStyle = { justifyContent: "start" },
}: {
  label: string;
  value: number;
  dangerous?: boolean;
  barStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}) {
  const dangerousValue = dangerous ?? value < 25;
  return (
    <div
      className="flex w-full justify-start items-center mb-[-4px]"
      style={containerStyle}
    >
      <p className="font-pixel w-18">{label}</p>
      <div className="border-2 h-3 border-black" style={barStyle}>
        <div
          className={`h-full ${dangerousValue ? "bg-red-500" : "bg-black"} transition-all duration-100`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
