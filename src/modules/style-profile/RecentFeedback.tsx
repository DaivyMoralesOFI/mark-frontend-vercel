import { Card } from "@/shared/components/ui/card"

const feedbackImages = [
  { id: 1, url: "/image1.jpg" },
  { id: 2, url: "/image2.jpg" },
  { id: 3, url: "/image3.jpg" },
  { id: 4, url: "/image4.jpg" },
]

export function RecentFeedback() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Feedback</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {feedbackImages.map((image) => (
          <div key={image.id} className="aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={image.url || "/placeholder.svg"}
              alt={`Feedback ${image.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
