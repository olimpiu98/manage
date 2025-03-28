import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for gallery
const galleryImages = [
  { id: 1, title: "Guild Formation", category: "events", date: "2023-05-15", src: "/images/hero.jpg" },
  { id: 2, title: "First Raid Victory", category: "raids", date: "2023-06-20", src: "/images/hero.jpg" },
  { id: 3, title: "Territory Conquest", category: "pvp", date: "2023-07-10", src: "/images/hero.jpg" },
  { id: 4, title: "Guild Meeting", category: "events", date: "2023-08-05", src: "/images/hero.jpg" },
  { id: 5, title: "Dragon's Lair Raid", category: "raids", date: "2023-09-15", src: "/images/hero.jpg" },
  { id: 6, title: "PvP Tournament", category: "pvp", date: "2023-10-20", src: "/images/hero.jpg" },
  { id: 7, title: "Halloween Event", category: "events", date: "2023-10-31", src: "/images/hero.jpg" },
  { id: 8, title: "Crystal Caverns Exploration", category: "raids", date: "2023-11-15", src: "/images/hero.jpg" },
  { id: 9, title: "Guild vs Guild Battle", category: "pvp", date: "2023-12-10", src: "/images/hero.jpg" },
  { id: 10, title: "Winter Celebration", category: "events", date: "2023-12-25", src: "/images/hero.jpg" },
  { id: 11, title: "New Year's Event", category: "events", date: "2024-01-01", src: "/images/hero.jpg" },
  { id: 12, title: "Throne of Shadows Raid", category: "raids", date: "2024-01-15", src: "/images/hero.jpg" },
]

export default function GalleryPage() {
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 anatolion-title">Guild Gallery</h1>
          <div className="w-24 h-1 bg-[#e8deb3]/30 mx-auto"></div>
          <p className="mt-6 max-w-3xl mx-auto opacity-90 text-lg">
            Memories and moments from our adventures in Throne and Liberty
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-[#0a0a12]/80 border border-[#e8deb3]/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#e8deb3]/20">
                All
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-[#e8deb3]/20">
                Events
              </TabsTrigger>
              <TabsTrigger value="raids" className="data-[state=active]:bg-[#e8deb3]/20">
                Raids
              </TabsTrigger>
              <TabsTrigger value="pvp" className="data-[state=active]:bg-[#e8deb3]/20">
                PvP
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <GalleryItem key={image.id} image={image} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages
                .filter((img) => img.category === "events")
                .map((image) => (
                  <GalleryItem key={image.id} image={image} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="raids" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages
                .filter((img) => img.category === "raids")
                .map((image) => (
                  <GalleryItem key={image.id} image={image} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pvp" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages
                .filter((img) => img.category === "pvp")
                .map((image) => (
                  <GalleryItem key={image.id} image={image} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Button className="anatolion-button px-6 py-3">Load More</Button>
        </div>
      </div>
    </div>
  )
}

function GalleryItem({ image }) {
  return (
    <div className="anatolion-card rounded-lg overflow-hidden group">
      <div className="relative aspect-video">
        <Image
          src={image.src || "/placeholder.svg"}
          alt={image.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{image.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm opacity-70">{new Date(image.date).toLocaleDateString()}</span>
          <span className="text-xs px-2 py-1 bg-[#e8deb3]/10 rounded capitalize">{image.category}</span>
        </div>
      </div>
    </div>
  )
}

