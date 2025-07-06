import {Header} from "../../../components";


const Dashboard = () => {
    const user = {
        name: "Tim"
    }
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Bienvenue ${user?.name ?? 'Invité'} 👋 `}
                description="Voir les activités et les destinations les plus populaires en temps réel"
            />

            Dashboard Page Content

        </main>
    )
}
export default Dashboard
