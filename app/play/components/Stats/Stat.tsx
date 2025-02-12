export default function Stat({
  label,
  value, // out of 100
  dangerous,
  barStyle = { width: "100px" },
  containerStyle = { justifyContent: "end" },
}: {
  label: string;
  value: number;
  dangerous?: boolean;
  barStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}) {
  const dangerousValue = dangerous ?? value < 25;
  return (
    <div className={`flex items-center mb-[-4px]`} style={containerStyle}>
      <p className="font-pixel">{label}</p>
      <div className={`ml-2 border-2 h-3 border-black`} style={barStyle}>
        <div
          className={`h-full ${dangerousValue ? "bg-red-500" : "bg-black"}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
