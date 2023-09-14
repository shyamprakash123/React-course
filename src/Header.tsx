/* eslint-disable jsx-a11y/no-access-key */
import { ActiveLink } from "raviger";
import logo from "./logo.svg";
import { User } from "./types/userTypes";

export default function Header(props: { currentUser: User }) {
  return (
    <div className="flex ">
      <img src={logo} className="animate-spin h-16 w-16" alt="logo" />
      <div className="flex justify-center items-center font-semibold">
        {[
          { page: "Home", url: "/", key: "h" },
          { page: "About", url: "/about", key: "a" },
          ...(props.currentUser?.username.length > 0
            ? [
                {
                  page: "Logout",
                  onClick: () => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  },
                },
              ]
            : [{ page: "Login", url: "/login", key: "l" }]),
        ].map((link) =>
          link.url ? (
            <ActiveLink
              accessKey={link.key}
              title={`ALT + ${link.key.toUpperCase()}`}
              key={link.url}
              href={link.url}
              className="text-gray-800 p-2 m-2 uppercase"
              exactActiveClass="text-blue-600"
            >
              {link.page}
            </ActiveLink>
          ) : (
            <button
              accessKey="l"
              title={`ALT + L`}
              key={link.page}
              className="text-gray-800 p-2 m-2 uppercase"
              onClick={link.onClick}
            >
              {link.page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
