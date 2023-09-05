import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Home from "../components/Home";
import Form from "../components/Form";
import PreviewPage from "../components/PreviewPage";
import QuizNotFound from "../components/QuizNotFound";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/forms": () => <Form />,
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewPage id={Number(formId)} />
  ),
  "/QuizNotFound": () => <QuizNotFound />,
};

export default function AppRouter() {
  let routeResult = useRoutes(routes);
  if (routeResult) {
    return <AppContainer>{routeResult}</AppContainer>;
  }
  return (
    <AppContainer>
      <Home />
    </AppContainer>
  );
}
