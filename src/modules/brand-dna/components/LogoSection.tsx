import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Upload } from "lucide-react"

export function LogoSection() {
  return (
    <Card className="overflow-hidden w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Logo</h3>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Replace
          </Button>
        </div>

        <div className="aspect-square rounded-lg flex items-center justify-center p-8 border border-border">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src="/ofi-original.svg" 
              alt="OFI Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
