import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import { User } from "../types/userTypes";
import React from "react";
const Home = React.lazy(() => import("../components/Home"));
const Login = React.lazy(() => import("../components/Login"));
const QuizNotFound = React.lazy(() => import("../components/QuizNotFound"));
const Unauthenticated = React.lazy(
  () => import("../components/Unauthenticated")
);
const PreviewPage = React.lazy(() => import("../components/PreviewPage"));
const Form = React.lazy(() => import("../components/Form"));
const About = React.lazy(() => import("../components/About"));

const routes = {
  "/": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Home />
    </React.Suspense>
  ),
  "/about": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <About />
    </React.Suspense>
  ),
  "/login": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Login />
    </React.Suspense>
  ),
  "/forms/:id": ({ id }: { id: string }) => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Form id={Number(id)} />
    </React.Suspense>
  ),
  "/forms": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Form />
    </React.Suspense>
  ),
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <PreviewPage id={Number(formId)} />
    </React.Suspense>
  ),
  "/QuizNotFound": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <QuizNotFound />
    </React.Suspense>
  ),
  "/Unauthenticated": () => (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Unauthenticated />
    </React.Suspense>
  ),
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
        <React.Suspense fallback={<h1>Loading...</h1>}>
          <Home />
        </React.Suspense>
      </AppContainer>
    );
  }
}
