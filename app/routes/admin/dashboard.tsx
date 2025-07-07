import {Header, StatsCard, TripCard} from "../../../components";
import {dashboardStats, users, allTrips} from "~/constants";
import {getUser} from "~/appwrite/auth";
import type { Route } from './+types/dashboard'


const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole} = dashboardStats;


export const clientLoader = async () => await getUser();

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData as user | null;
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Bienvenue ${user?.name ?? 'Invité'} 👋 `}
                description="Voir les activités et les destinations les plus populaires en temps réel"
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Utilisateurs total"
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Voyages total"
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Utilisateurs actifs aujourd'hui"
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">
                    Voyages crées
                </h1>
                <div className="trip-grid">
                    {allTrips.slice(0, 4).map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
                        <TripCard
                        key={id}
                        id={id.toString()}
                        name={name}
                        imageUrl={imageUrls[0]}
                        location={itinerary?.[0]?.location ?? ''}
                        tags={tags}
                        price={estimatedPrice}
                        />
                    ))}
                </div>
            </section>

        </main>
    )
}
export default Dashboard
