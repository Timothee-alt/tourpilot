import {logoutUser} from "~/appwrite/auth";

const PageLayout = () => {
    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in');
    }
    return (
        <div>
            <button onClick={handleLogout}
                    className="cursor-pointer"
            >
                <img
                    src="/assets/icons/logout.svg"
                    alt="Logout"
                    className="size-6"
                />
            </button>
            <button onClick={() => {navigate('/dashboard')}} >
                Dashboard
            </button>
        </div>
    )
}
export default PageLayout
