import Image from "next/image";

const GALLERY_IMAGES = [
  {
    src: "/images/vmp-villa-building.jpg",
    alt: "VMP Villa Home Stay building exterior lit up at dusk, Agra",
    cls: "gallery-img-1",
  },
  {
    src: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=500&q=80",
    alt: "Breakfast at VMP Villa",
    cls: "gallery-img-2",
  },
  {
    src: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80",
    alt: "Agra Taj Mahal nearby",
    cls: "gallery-img-3",
  },
  {
    src: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=500&q=80",
    alt: "VMP Villa terrace",
    cls: "gallery-img-4",
  },
  {
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80",
    alt: "VMP Villa room interior",
    cls: "gallery-img-5",
    overlay: true,
  },
];

export default function Gallery() {
  return (
    <div className="bg-cream" style={{ padding: "80px 40px" }} id="gallery">
      <div className="max-w-[1100px] mx-auto mb-10">
        <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
          Photo Tour
        </div>
        <h2
          className="font-display font-bold text-ink mb-3.5"
          style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
        >
          See VMP Villa <em className="not-italic text-saffron">for yourself</em>
        </h2>
        <p className="text-muted text-[15px] leading-[1.7] max-w-[560px]">
          Scroll through rooms, gardens, food, and Agra. Follow us{" "}
          <a
            href="https://instagram.com/vmp_homestay_agra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron font-medium hover:underline"
          >
            @vmp_homestay_agra
          </a>{" "}
          for daily stories.
        </p>
      </div>

      <div className="gallery-grid max-w-[1100px] mx-auto">
        {GALLERY_IMAGES.map((img) => (
          <div
            key={img.src}
            className={`${img.cls} relative rounded-xl overflow-hidden bg-marble group cursor-pointer`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            {img.overlay && (
              <div className="absolute inset-0 bg-ink/70 flex flex-col items-center justify-center rounded-xl">
                <div className="font-display text-[22px] font-bold text-white">+18 More</div>
                <div className="text-xs text-white/65">View Full Gallery</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          #gallery { padding: 60px 20px !important; }
        }
      `}</style>
    </div>
  );
}
