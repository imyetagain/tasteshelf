import { useNavigate } from 'react-router-dom';

interface Product {
  company: string;
  product: string;
  isFirstRow: boolean;
}

export function ProductCard({ company, product, isFirstRow }: Product) {
  const navigate = useNavigate();

  return (
    <div
      className={`w-[360px] h-[120px] flex gap-5 items-center overflow-hidden group cursor-pointer shrink-0 ${
        isFirstRow ? 'border-y' : 'border-b'
      }`}
      onClick={() =>
        navigate(
          `/item/${company.replaceAll(' ', '-').toLowerCase()}/${product.replaceAll(' ', '-').toLowerCase()}`,
        )
      }
    >
      <img
        src="https://shop.rosemont.ca/cdn/shop/products/mtndew_800x_f038c4c5-9adc-421f-a1b5-ea3f8c29980a.png?v=1627145543"
        className="h-20 shrink-0 aspect-square"
        alt="Beverage Product"
      />
      <div className="overflow-hidden flex flex-col gap-1">
        <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
          {company}
        </small>
        <p className="text-ellipsis overflow-hidden whitespace-nowrap group-hover:underline">
          {product}
        </p>
      </div>
    </div>
  );
}
