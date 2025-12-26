import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultExtractorForm,
  ExtractorFormData,
  extractorSchema,
} from "../schemas/brand-extractor.schema";
import { Button } from "@/shared/components/ui/button";
import { Sparkles } from "lucide-react";
import { Card } from "@/shared/components/ui/card";

const Extractor = () => {
  const onSubmit = async (data: ExtractorFormData) => {
    console.log({ data });
  };

  const _form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorSchema),
    defaultValues: defaultExtractorForm,
  });

  return (
    <div className="min-w-svw min-h-svh max-w-svw max-h-svh m-0 p-0 bg-background relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      <div className="wrapper w-svw h-svh m-0 flex justify-center items-center relative z-[999] flex-col gap-12">
        <Card className="main-input bg-card py-16 md:py-4 px-8 rounded-lg border-border max-w-[90%]">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center w-full">
              <h1 className="mb-3 text-[10cqw] md:text-[4cqw] title text-title leading-[2.4rem] md:leading-[3.2rem]">
                From your website <br /> to your Brand DNA
              </h1>
              <h3 className="mb-4 text-gray-500">
                Your visual identity and design foundation, easily
              </h3>
            </div>
            <div className="w-full flex flex-col gap-3">
              <form
                onSubmit={_form.handleSubmit(onSubmit)}
                noValidate
                id="brand-extractor-form"
                className="w-full"
              >
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      name="brandUrl"
                      control={_form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Input
                            {...field}
                            id={`input-url-form`}
                            aria-invalid={fieldState.invalid}
                            placeholder="www.example.com"
                            required
                            className="py-7"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
              </form>
              <Field orientation="horizontal" className="justify-end">
                <Button
                  type="submit"
                  form={`brand-extractor-form`}
                  className="py-8 rounded-md w-full "
                  variant="agent"
                >
                    <Sparkles/>
                    Discover now
                </Button>
              </Field>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Extractor;
