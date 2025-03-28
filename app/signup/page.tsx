"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Sword, Heart } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    characterName: "",
    email: "",
    password: "",
    confirmPassword: "",
    level: "",
    class: "",
    preferredRole: "",
    experience: "",
    availability: "",
    about: "",
    agreeToTerms: false,
  })

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.characterName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    return true
  }

  const validateStep2 = () => {
    if (!formData.level || !formData.class || !formData.preferredRole) {
      setError("Please fill in all required fields")
      return false
    }

    return true
  }

  const validateStep3 = () => {
    if (!formData.experience || !formData.availability || !formData.about) {
      setError("Please fill in all required fields")
      return false
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the guild rules and terms")
      return false
    }

    return true
  }

  const nextStep = () => {
    setError("")

    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateStep3()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real application, you would submit all form data
      // For this demo, we'll just use the auth service to create an account
      const result = await signUp(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your guild application has been received. We'll review it and contact you soon.",
        })
        router.push("/")
      } else {
        setError("Failed to submit application. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="characterName" className="block mb-2 text-sm font-medium">
            Character Name *
          </label>
          <Input
            id="characterName"
            name="characterName"
            value={formData.characterName}
            onChange={handleChange}
            placeholder="Your in-game character name"
            required
            className="anatolion-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
            className="anatolion-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password *
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            className="anatolion-input"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            Confirm Password *
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="anatolion-input"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 flex justify-end">
        <Button type="button" className="anatolion-button" onClick={nextStep}>
          Next
        </Button>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="level" className="block mb-2 text-sm font-medium">
            Character Level *
          </label>
          <Input
            id="level"
            name="level"
            type="number"
            min="1"
            max="60"
            value={formData.level}
            onChange={handleChange}
            placeholder="Your current level"
            required
            className="anatolion-input"
          />
        </div>

        <div>
          <label htmlFor="class" className="block mb-2 text-sm font-medium">
            Character Class *
          </label>
          <div className="form-group">
            <label htmlFor="class" className="form-label">
              Character Class *
            </label>
            <Select
              name="class"
              value={formData.class}
              onValueChange={(value) => handleSelectChange("class", value)}
              required
            >
              <SelectTrigger className="anatolion-input">
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent className="anatolion-card">
                <SelectItem value="warrior">Warrior</SelectItem>
                <SelectItem value="paladin">Paladin</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="assassin">Assassin</SelectItem>
                <SelectItem value="ranger">Ranger</SelectItem>
                <SelectItem value="mage">Mage</SelectItem>
                <SelectItem value="warlock">Warlock</SelectItem>
                <SelectItem value="priest">Priest</SelectItem>
                <SelectItem value="cleric">Cleric</SelectItem>
                <SelectItem value="druid">Druid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="preferredRole" className="block mb-2 text-sm font-medium">
            Preferred Role *
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`anatolion-card p-4 rounded-lg text-center cursor-pointer transition-all ${
                formData.preferredRole === "tank" ? "border-2 border-[#e8deb3]" : "border border-[#e8deb3]/20"
              }`}
              onClick={() => handleSelectChange("preferredRole", "tank")}
            >
              <div className="w-12 h-12 anatolion-role-tank rounded-full mx-auto flex items-center justify-center mb-2">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-medium">Tank</span>
            </div>

            <div
              className={`anatolion-card p-4 rounded-lg text-center cursor-pointer transition-all ${
                formData.preferredRole === "dps" ? "border-2 border-[#e8deb3]" : "border border-[#e8deb3]/20"
              }`}
              onClick={() => handleSelectChange("preferredRole", "dps")}
            >
              <div className="w-12 h-12 anatolion-role-dps rounded-full mx-auto flex items-center justify-center mb-2">
                <Sword className="h-6 w-6" />
              </div>
              <span className="font-medium">DPS</span>
            </div>

            <div
              className={`anatolion-card p-4 rounded-lg text-center cursor-pointer transition-all ${
                formData.preferredRole === "healer" ? "border-2 border-[#e8deb3]" : "border border-[#e8deb3]/20"
              }`}
              onClick={() => handleSelectChange("preferredRole", "healer")}
            >
              <div className="w-12 h-12 anatolion-role-healer rounded-full mx-auto flex items-center justify-center mb-2">
                <Heart className="h-6 w-6" />
              </div>
              <span className="font-medium">Healer</span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="border-[#e8deb3]/30 hover:bg-[#e8deb3]/10"
          onClick={prevStep}
        >
          Back
        </Button>
        <Button type="button" className="anatolion-button" onClick={nextStep}>
          Next
        </Button>
      </div>
    </>
  )

  const renderStep3 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="experience" className="block mb-2 text-sm font-medium">
            MMO Experience *
          </label>
          <Select
            name="experience"
            value={formData.experience}
            onValueChange={(value) => handleSelectChange("experience", value)}
            required
          >
            <SelectTrigger className="anatolion-input">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent className="anatolion-card">
              <SelectItem value="new">New to MMOs</SelectItem>
              <SelectItem value="casual">Casual Experience (1-2 years)</SelectItem>
              <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
              <SelectItem value="veteran">Veteran (5+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="availability" className="block mb-2 text-sm font-medium">
            Weekly Availability *
          </label>
          <Select
            name="availability"
            value={formData.availability}
            onValueChange={(value) => handleSelectChange("availability", value)}
            required
          >
            <SelectTrigger className="anatolion-input">
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent className="anatolion-card">
              <SelectItem value="casual">Casual (1-2 days per week)</SelectItem>
              <SelectItem value="regular">Regular (3-4 days per week)</SelectItem>
              <SelectItem value="active">Active (5+ days per week)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="about" className="block mb-2 text-sm font-medium">
            About Yourself *
          </label>
          <Textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell us about yourself, your playstyle, and why you want to join Anatolion Guild"
            rows={5}
            required
            className="anatolion-input"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))}
          />
          <label htmlFor="agreeToTerms" className="text-sm">
            I agree to the{" "}
            <Link href="/rules" className="text-[#e8deb3] hover:underline">
              guild rules
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-[#e8deb3] hover:underline">
              terms of service
            </Link>
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="border-[#e8deb3]/30 hover:bg-[#e8deb3]/10"
          onClick={prevStep}
        >
          Back
        </Button>
        <Button type="submit" className="anatolion-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </>
  )

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 anatolion-title">Join Anatolion Guild</h1>
            <p className="opacity-90">Complete the application form below to join our ranks in Throne and Liberty</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-[#e8deb3]" : "text-[#e8deb3]/50"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-[#e8deb3]/20 border-2 border-[#e8deb3]"
                      : "bg-[#e8deb3]/10 border border-[#e8deb3]/30"
                  }`}
                >
                  1
                </div>
                <span className="mt-2 text-sm">Account</span>
              </div>

              <div className={`flex flex-col items-center ${step >= 2 ? "text-[#e8deb3]" : "text-[#e8deb3]/50"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-[#e8deb3]/20 border-2 border-[#e8deb3]"
                      : "bg-[#e8deb3]/10 border border-[#e8deb3]/30"
                  }`}
                >
                  2
                </div>
                <span className="mt-2 text-sm">Character</span>
              </div>

              <div className={`flex flex-col items-center ${step >= 3 ? "text-[#e8deb3]" : "text-[#e8deb3]/50"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-[#e8deb3]/20 border-2 border-[#e8deb3]"
                      : "bg-[#e8deb3]/10 border border-[#e8deb3]/30"
                  }`}
                >
                  3
                </div>
                <span className="mt-2 text-sm">Details</span>
              </div>

              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#e8deb3]/10 -z-10"></div>
            </div>
          </div>

          <div className="anatolion-card p-8 rounded-lg">
            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </form>
          </div>

          <div className="text-center mt-8 opacity-80 text-sm">
            Already a member?{" "}
            <Link href="/parties" className="text-[#e8deb3] hover:underline">
              Go to Party Management
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

