import {Header} from "../../../components";

const Trips = () => {
    return (
        <main className="all-users wrapper">
            <Header
                title="Voyages"
                description="Voir et modifier les voyages générés par l'IA"
                ctaText="Créer un voyage"
                ctaUrl="/trips/create"
            />
        </main>
    )
}
export default Trips
