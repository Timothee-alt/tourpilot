import {Link, NavLink, useLoaderData, useNavigate} from "react-router";
import {sidebarItems} from "~/constants";
import {cn} from "~/lib/utils";
import {logoutUser} from "~/appwrite/auth";

const NavItems = ({handleClick}: {handleClick?: () => void }) => {
    const user = useLoaderData();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in');
    }
    return (


        <section className="nav-items">
            <Link to='/' className="link-logo">
                <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                <h1>Tourpilot</h1>
            </Link>
            <div className="container">
                <nav>
                    {sidebarItems.map(({ id, href, icon, label}) => (
                        <NavLink to={href} key={id}>
                            {( { isActive } : { isActive: boolean}) => (
                                <div className={cn('group nav-item', {
                                    'bg-primary-100 !text-white' : isActive
                                })} onClick={handleClick}>
                                    <img
                                    src={icon}
                                    alt={icon}
                                    className={`group-hover:brightness-0 size-0 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <footer className="nav-footer">

                    <img src={user?.imageUrl || 'assets/images/davis.webp'} alt={user?.name || 'David'} referrerPolicy="no-referrer"/>

                    <article>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </article>
                    <button onClick={handleLogout}
                    className="cursor-pointer"
                    >
                        <img
                        src="/assets/icons/logout.svg"
                        alt="Logout"
                        className="size-6"
                        />
                    </button>
                </footer>
            </div>
        </section>
    )
}
export default NavItems
