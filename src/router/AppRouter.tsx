import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Home from "../components/Home";
import Form from "../components/Form";
import PreviewPage from "../components/PreviewPage";
import QuizNotFound from "../components/QuizNotFound";
import Login from "../components/Login";
import { User } from "../types/userTypes";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/login": () => <Login />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/forms": () => <Form />,
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewPage id={Number(formId)} />
  ),
  "/QuizNotFound": () => <QuizNotFound />,
};

export default function AppRouter(props: { currentUser: User }) {
  let routeResult = useRoutes(routes);
  if (routeResult) {
    return (
      <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
    );
  }
  return (
    <AppContainer currentUser={props.currentUser}>
      <Home />
    </AppContainer>
  );
}
