import Image from "next/image"
import { Shield, Sword, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for guild members
const guildMembers = [
  { id: 1, name: "Thorian", role: "tank", level: 60, class: "Guardian", joinDate: "2023-05-15", isOfficer: true },
  { id: 2, name: "Lyandra", role: "dps", level: 60, class: "Assassin", joinDate: "2023-05-15", isOfficer: true },
  { id: 3, name: "Kaelar", role: "healer", level: 60, class: "Cleric", joinDate: "2023-05-15", isOfficer: true },
  { id: 4, name: "Elara", role: "dps", level: 60, class: "Mage", joinDate: "2023-05-15", isOfficer: true },
  { id: 5, name: "Gareth", role: "tank", level: 58, class: "Warrior", joinDate: "2023-06-20", isOfficer: false },
  { id: 6, name: "Seraphina", role: "healer", level: 59, class: "Priest", joinDate: "2023-06-25", isOfficer: false },
  { id: 7, name: "Darian", role: "dps", level: 57, class: "Ranger", joinDate: "2023-07-10", isOfficer: false },
  { id: 8, name: "Isolde", role: "dps", level: 56, class: "Warlock", joinDate: "2023-07-15", isOfficer: false },
  { id: 9, name: "Thorne", role: "tank", level: 55, class: "Paladin", joinDate: "2023-08-05", isOfficer: false },
  { id: 10, name: "Lirien", role: "healer", level: 54, class: "Druid", joinDate: "2023-08-20", isOfficer: false },
  { id: 11, name: "Varian", role: "dps", level: 53, class: "Berserker", joinDate: "2023-09-10", isOfficer: false },
  { id: 12, name: "Elysia", role: "dps", level: 52, class: "Bard", joinDate: "2023-09-25", isOfficer: false },
  { id: 13, name: "Rowan", role: "tank", level: 51, class: "Knight", joinDate: "2023-10-15", isOfficer: false },
  { id: 14, name: "Nessa", role: "healer", level: 50, class: "Shaman", joinDate: "2023-10-30", isOfficer: false },
  { id: 15, name: "Alaric", role: "dps", level: 49, class: "Necromancer", joinDate: "2023-11-15", isOfficer: false },
  { id: 16, name: "Freya", role: "dps", level: 48, class: "Elementalist", joinDate: "2023-11-30", isOfficer: false },
]

export default function RosterPage() {
  // Count members by role
  const tankCount = guildMembers.filter((member) => member.role === "tank").length
  const dpsCount = guildMembers.filter((member) => member.role === "dps").length
  const healerCount = guildMembers.filter((member) => member.role === "healer").length

  // Role icons and colors
  const roleIcons = {
    tank: <Shield className="h-5 w-5" />,
    dps: <Sword className="h-5 w-5" />,
    healer: <Heart className="h-5 w-5" />,
  }

  const roleColors = {
    tank: "anatolion-role-tank",
    dps: "anatolion-role-dps",
    healer: "anatolion-role-healer",
  }

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 anatolion-title">Guild Roster</h1>
          <div className="w-24 h-1 bg-[#e8deb3]/30 mx-auto"></div>
          <p className="mt-6 max-w-3xl mx-auto opacity-90 text-lg">
            Meet the brave souls who make up the Anatolion Guild
          </p>
        </div>

        {/* Role Distribution */}
        <div className="anatolion-card p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-6">Role Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${roleColors.tank} flex items-center justify-center`}>
                {roleIcons.tank}
              </div>
              <div>
                <h3 className="font-semibold">Tanks</h3>
                <p className="text-2xl">
                  {tankCount} <span className="text-sm opacity-70">members</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${roleColors.dps} flex items-center justify-center`}>
                {roleIcons.dps}
              </div>
              <div>
                <h3 className="font-semibold">DPS</h3>
                <p className="text-2xl">
                  {dpsCount} <span className="text-sm opacity-70">members</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${roleColors.healer} flex items-center justify-center`}>
                {roleIcons.healer}
              </div>
              <div>
                <h3 className="font-semibold">Healers</h3>
                <p className="text-2xl">
                  {healerCount} <span className="text-sm opacity-70">members</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member List */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Guild Members</h2>

          {/* Officers */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 border-b border-[#e8deb3]/20 pb-2">Officers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guildMembers
                .filter((member) => member.isOfficer)
                .map((member) => (
                  <div key={member.id} className="anatolion-card p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image src="/images/hero.jpg" alt={member.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <div className="flex items-center gap-1 text-sm opacity-80">
                          <span>Lvl {member.level}</span>
                          <span className="mx-1">•</span>
                          <span>{member.class}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div
                            className={`w-5 h-5 rounded-full ${roleColors[member.role]} flex items-center justify-center`}
                          >
                            {roleIcons[member.role]}
                          </div>
                          <span className="text-xs opacity-70 capitalize">{member.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Regular Members */}
          <div>
            <h3 className="text-xl font-medium mb-4 border-b border-[#e8deb3]/20 pb-2">Members</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e8deb3]/20">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Class</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Level</th>
                    <th className="text-left py-3 px-4">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {guildMembers
                    .filter((member) => !member.isOfficer)
                    .map((member) => (
                      <tr key={member.id} className="border-b border-[#e8deb3]/10 hover:bg-[#e8deb3]/5">
                        <td className="py-3 px-4">{member.name}</td>
                        <td className="py-3 px-4">{member.class}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full ${roleColors[member.role]} flex items-center justify-center`}
                            >
                              {roleIcons[member.role]}
                            </div>
                            <span className="capitalize">{member.role}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{member.level}</td>
                        <td className="py-3 px-4">{new Date(member.joinDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="anatolion-card p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Join Our Ranks?</h2>
          <p className="max-w-2xl mx-auto mb-6 opacity-90">
            We're always looking for dedicated players to strengthen our guild. Apply today and become part of our
            legacy.
          </p>
          <Link href="/signup">
            <Button className="anatolion-button px-6 py-3">Apply to Join</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

