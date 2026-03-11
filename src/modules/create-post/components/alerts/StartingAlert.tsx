import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Sparkles, Type, ImagePlus, Sliders } from "lucide-react";

type StartingAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const steps = [
  {
    icon: <Type className="w-4 h-4" />,
    label: "Write your prompt",
    description: "Describe the content you want to create",
  },
  {
    icon: <ImagePlus className="w-4 h-4" />,
    label: "Upload a reference",
    description: "Optionally attach an image for inspiration",
  },
  {
    icon: <Sliders className="w-4 h-4" />,
    label: "Set tone, type & platform",
    description: "Fine-tune how your content is generated",
  },
];

export function StartingAlert({ open, onOpenChange }: StartingAlertProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        {/* Overlay */}
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <AlertDialogPrimitive.Content className="fixed top-1/2 left-1/2 z-[99999] w-full max-w-md -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 focus:outline-none">
          <div className="relative bg-white dark:bg-[#111113] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl shadow-2xl shadow-black/30 dark:shadow-black/60 overflow-hidden">

            {/* Glow accent top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#D946EF]/60 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D946EF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative px-7 pt-8 pb-7 flex flex-col gap-6">

              {/* Icon badge */}
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D946EF]/10 border border-[#D946EF]/20 shadow-lg shadow-[#D946EF]/10">
                  <Sparkles className="w-6 h-6 text-[#D946EF]" />
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-2xl bg-[#D946EF]/5 blur-sm" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center flex flex-col gap-2">
                <AlertDialogPrimitive.Title className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                  Welcome back to Creation Studio
                </AlertDialogPrimitive.Title>
                <AlertDialogPrimitive.Description className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Everything you need to craft stunning content — right here.
                </AlertDialogPrimitive.Description>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2.5">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 px-4 py-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.05]"
                  >
                    <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/15 text-[#D946EF]">
                      {step.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-neutral-800 dark:text-white/90">
                        {step.label}
                      </span>
                      <span className="text-xs text-neutral-500 leading-relaxed">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <AlertDialogPrimitive.Action
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white bg-[#D946EF] hover:bg-[#D946EF]/90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#D946EF]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D946EF]/50"
              >
                Let's start
              </AlertDialogPrimitive.Action>
            </div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
