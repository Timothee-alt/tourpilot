import { Link, type LoaderFunctionArgs, useSearchParams } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { cn, parseTripData } from "~/lib/utils";
import { Header, TripCard } from "../../../components";
import { getAllTrips } from "~/appwrite/trips";
import type { Route } from "../../../.react-router/types/app/routes/admin/+types/trips";
import { useState } from "react";
import { getUser } from "~/appwrite/auth";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

const FeaturedDestination = ({ containerClass = '', bigCard = false, rating, title, activityCount, bgImage }: DestinationProps) => (
    <section
        className={cn(
            'rounded-[20px] overflow-hidden bg-cover bg-center size-full min-w-[280px] relative group cursor-pointer',
            'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
            containerClass,
            bgImage
        )}
    >
        <div className="bg-gradient-to-t from-black/60 via-black/20 to-transparent h-full">
            <article className="featured-card p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full font-semibold text-[#FF6B6B] w-fit py-2 px-4 text-sm shadow-lg">
                        ⭐ {rating}
                    </div>
                    <div className="w-2 h-2 bg-[#FFD93D] rounded-full animate-pulse"></div>
                </div>
                <article className="flex flex-col gap-3">
                    <h2 className={cn(
                        'text-xl font-bold text-white drop-shadow-lg',
                        { 'text-2xl md:text-3xl': bigCard }
                    )}>
                        {title}
                    </h2>
                    <figure className="flex gap-3 items-center">
                        <img
                            src="/assets/images/david.webp"
                            alt="user"
                            className={cn(
                                'size-6 rounded-full aspect-square border-2 border-white/50',
                                { 'size-10': bigCard }
                            )}
                        />
                        <p className={cn(
                            'text-sm font-medium text-white/90',
                            { 'text-base': bigCard }
                        )}>
                            {activityCount} activités
                        </p>
                    </figure>
                </article>
            </article>
        </div>
    </section>
)

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || "1", 10);
    const offset = (page - 1) * limit;

    const [user, { allTrips, total }] = await Promise.all([
        getUser(),
        getAllTrips(limit, offset),
    ])

    return {
        trips: allTrips.map(({ $id, tripDetails, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        })),
        total
    }
}

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1')
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`
    }

    return (
        <main className="flex flex-col bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] min-h-screen">
            <section className="relative h-[100vh] w-full overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    className="absolute top-0 left-0 w-full h-full object-cover scale-110"
                >
                    <source src="/assets/video/hero-video.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

                <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 h-full flex flex-col justify-center text-white">
                    <article className="mb-8 max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            Planifiez facilement vos voyages
                        </h1>
                        <p className="text-xl sm:text-2xl md:text-2xl text-white/90 font-light leading-relaxed">
                            Personnalisez votre voyage en quelques minutes, selon vos préférences
                        </p>
                    </article>
                    <Link
                        to="#trips"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-max text-lg group"
                    >
                        Commencer l'aventure
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
                    </div>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 w-full">
                <Header
                    title="Nos destinations phares"
                    description="Découvrez les meilleurs endroits à visiter dans le monde"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    <div className="lg:col-span-1 space-y-6">
                        <FeaturedDestination
                            bgImage="bg-card-1"
                            containerClass="h-[400px]"
                            bigCard
                            title="Barcelone"
                            rating={4.2}
                            activityCount={196}
                        />
                        <FeaturedDestination
                            containerClass="h-[250px]"
                            bgImage="bg-card-4"
                            title="Venise"
                            rating={3.8}
                            activityCount={150}
                        />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <FeaturedDestination
                            containerClass="h-[250px]"
                            bgImage="bg-card-2"
                            title="Londres"
                            rating={4.5}
                            activityCount={512}
                        />
                        <FeaturedDestination
                            containerClass="h-[400px]"
                            bgImage="bg-card-5"
                            bigCard
                            title="Croatie"
                            rating={5}
                            activityCount={150}
                        />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <FeaturedDestination
                            containerClass="h-[320px]"
                            bgImage="bg-card-3"
                            title="Grèce"
                            rating={3.5}
                            activityCount={250}
                        />
                        <FeaturedDestination
                            containerClass="h-[330px]"
                            bgImage="bg-card-6"
                            title="Vietnam"
                            rating={4.2}
                            activityCount={500}
                        />
                    </div>
                </div>
            </section>

            <section id="trips" className="py-20 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
                    <Header
                        title="Voyages choisis avec soin"
                        description="Parcourez des voyages soigneusement organisés, adaptés à votre façon de voyager."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12 ">
                        {trips.map((trip, i) => (
                            <div key={trip.id} className="trip-card transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <TripCard
                                    id={trip.id}
                                    name={trip.name}
                                    imageUrl={trip.imageUrls[0]}
                                    location={trip.itinerary?.[0]?.location ?? ""}
                                    tags={[trip.interests, trip.travelStyle]}
                                    price={trip.estimatedPrice}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ">
                            <PagerComponent
                                totalRecordsCount={loaderData.total}
                                pageSize={8}
                                currentPage={currentPage}
                                click={(args) => handlePageChange(args.currentPage)}
                                cssClass="!mb-0 !p-2"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#2C3E50] text-white py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                            <img src="/assets/icons/logo.svg" alt="logo" className="size-8" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#00B4D8] bg-clip-text text-transparent">
                                TourPilot
                            </h1>
                        </Link>

                        <div className="flex gap-8">
                            {["Conditions générales", "Politique de confidentialité"].map((item) => (
                                <Link
                                    to="/"
                                    key={item}
                                    className="text-white/70 hover:text-white transition-colors duration-300 font-medium"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                        <p className="text-white/60">
                            © 2024 TourPilot. Tous droits réservés. Créé avec ❤️ pour les voyageurs.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}

export default TravelPage;