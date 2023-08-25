import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Home from "../components/Home";
import Form from "../components/Form";
import PreviewPage from "../components/PreviewPage";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/forms": () => <Form />,
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewPage id={Number(formId)} />
  ),
};

export default function AppRouter() {
  let routeResult = useRoutes(routes);
  return <AppContainer>{routeResult}</AppContainer>;
}
