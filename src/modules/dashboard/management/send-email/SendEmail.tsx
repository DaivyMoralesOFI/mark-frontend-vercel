import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/Input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Mail, Send, Loader } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { ScheduleModal } from "@/shared/components/ScheduleModal"

interface SendEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendEmailModal({ isOpen, onClose }: SendEmailModalProps) {
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState("")
  const [loadingSchedule, setLoadingSchedule] = useState(false)

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      return
    }

    setIsSending(true)

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Sending email:", emailData)

    // Reset form and close modal
    setEmailData({ to: "", cc: "", subject: "", body: "" })
    setIsSending(false)
    onClose()
  }

  const handleClose = () => {
    // Solo cierra el modal, no limpia los campos
    onClose()
  }

  const handleSuggestBody = async () => {
    if (loadingSuggestion) return
    setLoadingSuggestion(true)
    // Simula una sugerencia AI
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setEmailData((prev) => ({
      ...prev,
      body: "Esta es una sugerencia de cuerpo de correo generada automáticamente. Puedes personalizar este mensaje según tus necesidades. ¡Gracias por usar Mark!"
    }))
    setLoadingSuggestion(false)
  }

  const isEmailValid = !!emailData.to && !!emailData.subject && !!emailData.body

  const handleScheduleEmail = async () => {
    setLoadingSchedule(true)
    // Simula el agendado
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Email scheduled:", {
      ...emailData,
      scheduledDate,
      scheduledTime,
    })
    setEmailData({ to: "", cc: "", subject: "", body: "" })
    setScheduledDate(undefined)
    setScheduledTime("")
    setLoadingSchedule(false)
    setScheduleModalOpen(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <span>Send Email</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4">
            {/* To Field */}
            <div className="space-y-2">
              <Label htmlFor="to">To *</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com, another@example.com"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
            </div>

            {/* CC Field */}
            <div className="space-y-2">
              <Label htmlFor="cc">CC (optional)</Label>
              <Input
                id="cc"
                type="email"
                placeholder="cc@example.com"
                value={emailData.cc}
                onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="body">Message *</Label>
                <div className="relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 p-0"
                    aria-label="Sugerir cuerpo de correo con Mark"
                    disabled={
                      loadingSuggestion ||
                      isSending ||
                      !emailData.to ||
                      !emailData.subject ||
                      !emailData.body
                    }
                    onClick={handleSuggestBody}
                  >
                    {loadingSuggestion ? (
                      <Loader className="animate-spin w-5 h-5 text-purple-600" />
                    ) : (
                      <img src="/mark-magic-wand.png" alt="Mark icon" className="w-10 h-10" />
                    )}
                    <span className="sr-only">Sugerir cuerpo de correo con Mark</span>
                  </Button>
                </div>
              </div>
              <Textarea
                id="body"
                placeholder="Write your email message here..."
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                rows={8}
                className="w-full resize-y break-words break-all overflow-x-auto max-w-full"
              />
              <p className="text-xs text-gray-500">{emailData.body.length} characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button className="bg-red-600 hover:bg-red-700 text-white" variant="outline" onClick={handleClose} disabled={isSending}>
                Cancel
              </Button>
              <Button
                onClick={() => setScheduleModalOpen(true)}
                disabled={!isEmailValid || isSending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                type="button"
              >
                Schedule Email
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={!isEmailValid || isSending}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        scheduledDate={scheduledDate}
        scheduledTime={scheduledTime}
        loadingSchedule={loadingSchedule}
        onDateChange={setScheduledDate}
        onTimeChange={setScheduledTime}
        onConfirm={handleScheduleEmail}
        isValid={!!scheduledDate && !!scheduledTime}
      />
    </Dialog>
  )
}