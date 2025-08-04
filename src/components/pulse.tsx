export default function Pulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
    </span>
  );
}
