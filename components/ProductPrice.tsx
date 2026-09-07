import { SHIPPING_RON } from "@/lib/shipping";

interface ProductPriceProps {
  priceRon: number;
  className?: string;
  showTotal?: boolean;
}

export default function ProductPrice({
  priceRon,
  className = "",
  showTotal = false
}: ProductPriceProps) {
  return (
    <div className={className}>
      <p className="font-serif text-2xl text-bone">{priceRon} lei</p>
      <p className="mt-2 font-sans text-sm text-ash">
        + {SHIPPING_RON} lei transport
        {showTotal && (
          <>
            {" "}
            · Total estimat{" "}
            <span className="text-mist">{priceRon + SHIPPING_RON} lei</span>
          </>
        )}
      </p>
    </div>
  );
}
