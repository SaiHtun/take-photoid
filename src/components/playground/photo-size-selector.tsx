import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { photoIdSizes } from "~/constants";

export default function PhotoSizeSelector({
  selectedSize,
  onSizeChange,
}: {
  selectedSize: string;
  onSizeChange: (value: string) => void;
}) {
  return (
    <Select value={selectedSize} onValueChange={onSizeChange}>
      <SelectTrigger className="w-[160px] cursor-pointer">
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent>
        {photoIdSizes.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <div className="w-[120px] flex justify-between">
              <span>{item.country}</span>
              <span className="text-neutral-500 font-geist-mono">
                {item.size}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
