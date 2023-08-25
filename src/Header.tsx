import { ActiveLink } from "raviger";
import logo from "./logo.svg";

export default function Header() {
  return (
    <div className="flex ">
      <img src={logo} className="animate-spin h-16 w-16" alt="logo" />
      <div className="flex justify-center items-center font-semibold">
        {[
          { page: "Home", url: "/" },
          { page: "About", url: "/about" },
        ].map((link) => (
          <ActiveLink
            key={link.url}
            href={link.url}
            className="text-gray-800 p-2 m-2 uppercase"
            exactActiveClass="text-blue-600"
          >
            {link.page}
          </ActiveLink>
        ))}
        <ActiveLink
          href={"/forms"}
          className="text-gray-800 p-2 m-2 uppercase"
          exactActiveClass="text-blue-600"
        >
          Form
        </ActiveLink>
      </div>
    </div>
  );
}
