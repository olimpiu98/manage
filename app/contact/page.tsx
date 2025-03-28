"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "",
      })
    }, 1500)
  }

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 anatolion-title">Contact Us</h1>
          <div className="w-24 h-1 bg-[#e8deb3]/30 mx-auto"></div>
          <p className="mt-6 max-w-3xl mx-auto opacity-90 text-lg">
            Have questions about joining our guild or need to get in touch? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="anatolion-card p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-700/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className="opacity-80 mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button className="anatolion-button" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="anatolion-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="anatolion-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className="block mb-2 text-sm font-medium">
                      Inquiry Type
                    </label>
                    <Select value={formData.inquiryType} onValueChange={handleSelectChange} required>
                      <SelectTrigger className="anatolion-select">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent className="anatolion-card">
                        <SelectItem value="join">Joining the Guild</SelectItem>
                        <SelectItem value="event">Event Information</SelectItem>
                        <SelectItem value="alliance">Guild Alliance</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      required
                      className="anatolion-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                      rows={5}
                      required
                      className="anatolion-input"
                    />
                  </div>

                  <Button type="submit" className="anatolion-button w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <div className="anatolion-card p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-6">Guild Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8deb3]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="opacity-80">anatolion.guild@example.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8deb3]/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Discord</h3>
                    <p className="opacity-80">discord.gg/X3BBdDZbKG</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8deb3]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Server</h3>
                    <p className="opacity-80">Avalon - EU</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8deb3]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Active Hours</h3>
                    <p className="opacity-80">18:00 - 23:00 CET (Weekdays)</p>
                    <p className="opacity-80">14:00 - 00:00 CET (Weekends)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="anatolion-card p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">FAQ</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">How do I join the guild?</h3>
                  <p className="opacity-80 mt-2">
                    To join Anatolion Guild, you can apply through our website or contact us in-game. We review
                    applications regularly and will reach out to schedule an interview.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">What are the requirements to join?</h3>
                  <p className="opacity-80 mt-2">
                    We look for active players who are at least level 40, willing to participate in guild activities,
                    and can maintain a positive attitude. Experience is valued but not required.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">When do guild events take place?</h3>
                  <p className="opacity-80 mt-2">
                    We host raids on Tuesdays and Thursdays at 20:00 CET. PvP events typically occur on Wednesdays and
                    Saturdays. Social events are announced in our Discord.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Is the guild focused on PvE or PvP?</h3>
                  <p className="opacity-80 mt-2">
                    We maintain a healthy balance of both PvE and PvP content. Members are encouraged to participate in
                    both, but we understand if you have a preference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

