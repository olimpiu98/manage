import { Calendar, Clock, MapPin, Users, Trophy, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for events
const upcomingEvents = [
  {
    id: 1,
    title: "Weekly Raid: Throne of Shadows",
    date: "2024-04-15T19:00:00",
    location: "Shadowkeep Dungeon",
    description:
      "Our weekly raid to conquer the Throne of Shadows. Bring your best gear and be prepared for a challenging encounter.",
    type: "raid",
    requiredLevel: 50,
    participants: 24,
    maxParticipants: 30,
  },
  {
    id: 2,
    title: "Territory War: Northern Realms",
    date: "2024-04-17T20:00:00",
    location: "Frostpeak Territory",
    description:
      "Strategic battle to defend our territory in the Northern Realms. All guild members are encouraged to participate.",
    type: "pvp",
    requiredLevel: 45,
    participants: 35,
    maxParticipants: 50,
  },
  {
    id: 3,
    title: "Guild Meeting",
    date: "2024-04-19T18:00:00",
    location: "Guild Hall",
    description: "Monthly guild meeting to discuss upcoming events, strategies, and address member concerns.",
    type: "social",
    requiredLevel: 1,
    participants: 15,
    maxParticipants: 100,
  },
  {
    id: 4,
    title: "Dungeon Run: Crystal Caverns",
    date: "2024-04-20T19:00:00",
    location: "Crystal Caverns",
    description:
      "Dungeon run to help newer members gear up and learn mechanics. Experienced members welcome to help guide.",
    type: "dungeon",
    requiredLevel: 30,
    participants: 10,
    maxParticipants: 15,
  },
  {
    id: 5,
    title: "Guild vs Guild: Crimson Alliance",
    date: "2024-04-22T20:00:00",
    location: "Battle Arena",
    description: "Scheduled PvP battle against the Crimson Alliance guild. Glory and rewards await the victors!",
    type: "pvp",
    requiredLevel: 50,
    participants: 20,
    maxParticipants: 30,
  },
]

const pastEvents = [
  {
    id: 101,
    title: "Raid: Dragon's Lair",
    date: "2024-04-08T19:00:00",
    location: "Dragon's Lair",
    description: "Successfully conquered the Dragon's Lair raid and defeated the Ancient Dragon.",
    type: "raid",
    outcome: "Victory",
  },
  {
    id: 102,
    title: "Territory Defense: Eastern Shores",
    date: "2024-04-05T20:00:00",
    location: "Eastern Shores",
    description: "Defended our territory against multiple guild attacks.",
    type: "pvp",
    outcome: "Victory",
  },
  {
    id: 103,
    title: "Guild Anniversary Celebration",
    date: "2024-04-01T18:00:00",
    location: "Guild Hall",
    description: "Celebrated our guild's anniversary with games, contests, and prizes.",
    type: "social",
    outcome: "Success",
  },
]

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper function to format time
function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper function to get event type icon
function getEventTypeIcon(type: string) {
  switch (type) {
    case "raid":
      return <Shield className="h-5 w-5" />
    case "pvp":
      return <Trophy className="h-5 w-5" />
    case "social":
      return <Users className="h-5 w-5" />
    case "dungeon":
      return <Shield className="h-5 w-5" />
    default:
      return <Calendar className="h-5 w-5" />
  }
}

// Helper function to get event type color
function getEventTypeColor(type: string) {
  switch (type) {
    case "raid":
      return "bg-purple-700"
    case "pvp":
      return "bg-red-700"
    case "social":
      return "bg-blue-700"
    case "dungeon":
      return "bg-green-700"
    default:
      return "bg-gray-700"
  }
}

export default function EventsPage() {
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 anatolion-title">Guild Events</h1>
          <div className="w-24 h-1 bg-[#e8deb3]/30 mx-auto"></div>
          <p className="mt-6 max-w-3xl mx-auto opacity-90 text-lg">
            Join us for regular raids, PvP battles, and social gatherings
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 border-b border-[#e8deb3]/20 pb-2">Upcoming Events</h2>

          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="anatolion-card p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-16 flex flex-col items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center`}
                    >
                      {getEventTypeIcon(event.type)}
                    </div>
                    <span className="text-xs mt-2 capitalize">{event.type}</span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="opacity-90 mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 opacity-70" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-70" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 opacity-70" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 opacity-70" />
                        <span>
                          {event.participants}/{event.maxParticipants} Participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 opacity-70" />
                        <span>Level {event.requiredLevel}+ Required</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-32 flex justify-center">
                    <Button className="anatolion-button w-full">Sign Up</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b border-[#e8deb3]/20 pb-2">Past Events</h2>

          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="anatolion-card p-4 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center`}
                  >
                    {getEventTypeIcon(event.type)}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 opacity-70" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 opacity-70" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 opacity-70" />
                        <span>{event.outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button className="anatolion-button">View All Past Events</Button>
          </div>
        </section>

        {/* Calendar CTA */}
        <section className="mt-16">
          <div className="anatolion-card p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="max-w-2xl mx-auto mb-6 opacity-90">
              Subscribe to our guild calendar to never miss an event. Get notifications and reminders for all guild
              activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="anatolion-button px-6 py-3">Subscribe to Calendar</Button>
              <Link href="/contact">
                <Button className="anatolion-button px-6 py-3">Suggest an Event</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

