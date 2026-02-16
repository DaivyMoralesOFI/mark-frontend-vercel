import AccountSelector from "@/shared/components/dropdown/account-selector";
import { useBrands } from "@/modules/creation-studio/hooks/use-brands";

const BrandDNA = () => {
  const { data: brands, isLoading, error } = useBrands();
  return (
    <div className="w-full max-w-md h-full max-h-screen  m-0 px-3">
      <div className="w-full h-full flex flex-col justify-center items-center bg-surface-container-low border-2 border-primary rounded-md shadow-lg">
        <div className="flex flex-row justify-center items-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <p>{JSON.stringify(brands)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandDNA;
