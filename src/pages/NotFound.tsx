import { ButtonLink } from "../components/ds/Button";
import { Container } from "../components/ds/Layout";

export default function NotFound() {
  return (
    <Container className="py-20 md:py-28">
      <p className="text-sm tracking-widest text-mute uppercase">Error 404</p>
      <h1 className="mt-4 text-display font-light">Not here.</h1>
      <p className="mt-6 max-w-xl text-lg text-mute">That page does not exist. It may have moved.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/">Go home</ButtonLink>
        <ButtonLink to="/start" variant="secondary">
          Get started
        </ButtonLink>
      </div>
    </Container>
  );
}
