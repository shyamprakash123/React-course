import { useRoutes } from "raviger";
import About from "../components/About";
import AppContainer from "../AppContainer";
import Form from "../components/Form";
import PreviewPage from "../components/PreviewPage";
import QuizNotFound from "../components/QuizNotFound";
import Login from "../components/Login";
import Unauthenticated from "../components/Unauthenticated";
import { User } from "../types/userTypes";
import React from "react";
const Home = React.lazy(() => import("../components/Home"));

const routes = {
  "/": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Home />
    </React.Suspense>
  ),
  "/about": () => <About />,
  "/login": () => <Login />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/forms": () => <Form />,
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewPage id={Number(formId)} />
  ),
  "/QuizNotFound": () => <QuizNotFound />,
  "/Unauthenticated": () => <Unauthenticated />,
};

export default function AppRouter(props: { currentUser: User }) {
  let routeResult = useRoutes(routes);
  if (routeResult) {
    return (
      <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
    );
  } else {
    return (
      <AppContainer currentUser={props.currentUser}>
        <Home />
      </AppContainer>
    );
  }
}
