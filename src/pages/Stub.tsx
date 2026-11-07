import { ButtonLink } from "../components/ds/Button";
import { Container, SectionLabel } from "../components/ds/Layout";

/** Temporary page for routes still being built (replaced phase by phase). */
export default function Stub({ title }: { title: string }) {
  return (
    <Container className="py-20">
      <SectionLabel>Coming next</SectionLabel>
      <h1 className="mt-5 text-headline font-medium">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">
        This part of the prototype is still being built. The full calculator is available in the meantime.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/legacy">Open the calculator</ButtonLink>
        <ButtonLink to="/" variant="secondary">
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
